import re
import json
import requests
from playwright.sync_api import sync_playwright
from pydantic import BaseModel
from fastapi import FastAPI, APIRouter

router = APIRouter(tags=["Pension Grievance Assistant"],
                   responses={404: {"description": "Not found"}})

# Load environment variables
with open("./env.json", 'r') as file:
    env = json.load(file)

class QueryInput(BaseModel):
    ppo_no: str
    grievanceDescription: str

class GROResponseInput(BaseModel):
    grievanceDescription: str
    groresponse: str


def get_pensioner_id(user_input):
    pattern = r'\b(?:[A-Z0-9]+(?:/[A-Z0-9]+)+|[A-Z]+\d+|\d+)\b'
    return re.findall(pattern, user_input)


def get_pensioner_details(given_pensioner_id):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(env["PENSION_SYSTEM_URL"])
        page.wait_for_timeout(2000)

        table = page.query_selector("table")
        rows = table.query_selector_all("tr")
        th_elements = table.query_selector_all("th")

        column_names = ['_'.join(th.inner_text().lower().split(' ')) for th in th_elements]

        data = []
        for row in rows:
            cells = row.query_selector_all("td")
            row_data = {}
            for i, cell in enumerate(cells):
                row_data[f"{column_names[i]}"] = cell.inner_text()
            data.append(row_data)

        browser.close()

        for row in data:
            try:
                if row["pensioner_id"] == given_pensioner_id:
                    return row
            except KeyError:
                continue
        return {}



def get_groresponse_prompt(ppo_no, grievanceDescription):

    pensioner_id = ppo_no
    user_details = get_pensioner_details(pensioner_id)

    if not user_details:
        return f"No data found for pensioner ID: {pensioner_id}"

    prompt = f"""
    Your duty is to satisfy the user by providing a good response to user against thier grievance {grievanceDescription} with details
    {user_details}
    Keep it short and satisfactory to the complainant.
    Avoid providing fake details. Just use the information provided in the above JSON.
    """

    return prompt



def get_gro_response_by_llm(prompt):
    response = requests.post(
        env["LLAMA_API_URL"],
        json={'input': {'prompt': prompt}}
    )
    return response.json()["output"]



# 🦙 Prompt with instructions
def check_gro_response_prompt(complaint: str, gro_response: str) -> str:
    return f"""
You are analyzing a public grievance and the corresponding GRO (Grievance Redressal Officer) response.

Evaluate the following:
- relevance: How well the GRO response addresses the complaint (1 = not at all, 10 = fully addressed)

Respond in JSON format.

Complaint:
{complaint}

GRO Response:
{gro_response}

Output JSON:
{{
  "relevance": ...
}}
""".strip()



# 📡 Call Ollama-style API
def check_gro_response_by_llm(complaint: str, gro_response: str):
    prompt = check_gro_response_prompt(complaint, gro_response)
    response = requests.post(
        env["LLAMA_API_URL"],
        json={'input': {'prompt': prompt}}
    )
    if response.status_code != 200:
        raise ValueError(f"API error: {response.status_code} - {response.text}")

    return response.json().get("output") or response.json().get("response")



# 🧠 Extract JSON safely from mixed response
def extract_json(text: str):
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return json.loads(match.group(0))
    raise ValueError("No valid JSON found")


# Endpoint to handle input text
@router.post("/get_gro_response")
def get_gro_response_fn(input_data: QueryInput):
    prompt = get_groresponse_prompt(input_data.ppo_no, input_data.grievanceDescription)
    return {"response": get_gro_response_by_llm(prompt)}



# Endpoint to handle input text
@router.post("/check_gro_response")
def check_gro_response_fn(input_data: GROResponseInput):
    response = check_gro_response_by_llm(input_data.grievanceDescription, input_data.groresponse)
    return extract_json(response)
