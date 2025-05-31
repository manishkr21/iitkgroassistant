import json, requests
from playwright.sync_api import sync_playwright
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["MNREGA Grievance Assistant"],
                   responses={404: {"description": "Not found"}})


class QueryInput(BaseModel):
    work_id: str = ''
    worker_id: str = ''
    grievanceDescription: str = ''

# Load environment variables
with open("./env.json", 'r') as file:
    env = json.load(file)

def scrape_workers(given_worker_id: str = '', url: str = ''):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)
        # page.get_by_text("👷 Workers").click()
        # Wait for the worker accordion to load
        page.wait_for_selector(f'#workerId')

        # Select the AccordionDetails section by ID
        section = page.query_selector(f'#workerId')

        # Extract text from child boxes (each worker box)
        boxes = section.query_selector_all("div[class*=MuiBox-root]")

        results = []
        for box in boxes:
            text_content = box.inner_text()
            lines = text_content.splitlines()

            # Simple parser: extract values from lines
            name_line = lines[0]
            name, worker_id = name_line.rsplit("(", 1)
            worker_id = worker_id.replace(")", "").strip()

            def get_value(key):
                for line in lines:
                    if line.startswith(key):
                        return line.split(":", 1)[1].strip()
                return ""

            results.append({
                "name": name.strip(),
                "worker_id": worker_id,
                "age": get_value("Age"),
                "gender": get_value("Gender"),
                "caste": get_value("Caste"),
                "aadhaar_linked": get_value("Aadhaar Linked") == "Yes",
                "mobile": get_value("Mobile"),
                "village": get_value("Village"),
                "block": get_value("Block"),
                "district": get_value("District"),
                "state": get_value("State"),
                "bank_name": get_value("Bank"),
                "bank_account": get_value("A/C"),
                "ifsc": get_value("IFSC"),
            })

        browser.close()

        if given_worker_id:
            return {"workers": [worker for worker in results if worker["worker_id"] == given_worker_id]}

        return {"workers": results}



def scrape_works(given_work_id: str = '', url: str = ''):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)
        page.get_by_text("🛠️ Works").click()
        page.wait_for_selector("#workId")

        work = page.query_selector("#workId")
        if not work:
            return {"error": "Work section not found."}

        # Find all work boxes inside the AccordionDetails of Works
        work_boxes = work.query_selector_all("div[class*=MuiBox-root]")

        results = []

        for box in work_boxes:
            content = box.inner_text()
            if given_work_id and given_work_id not in content:
                continue

            lines = content.splitlines()
            title_line = lines[0]

            # ✅ Skip if the box doesn't contain a work title with work_id (e.g., "XYZ Work (123456)")
            if "(" not in title_line or ")" not in title_line or "Workers Involved:" in title_line:
                continue

            work_title = title_line.split("(")[0].strip()
            wid = title_line.split("(")[-1].replace(")", "").strip()

            def get_val(key):
                for line in lines:
                    if key in line:
                        return line.split(":", 1)[-1].strip()
                return ""

            work_obj = {
                "work_id": wid,
                "work_name": work_title,
                "start_date": get_val("Start Date"),
                "end_date": get_val("End Date"),
                "location": {
                    "village": get_val("Location"),
                    "block": get_val("Block"),
                    "district": get_val("District"),
                    "state": get_val("State")
                },
                "assigned_workers": []
            }

            # Find nested workers <ul> (usually second ul)
            uls = box.query_selector_all("ul")
            if len(uls) >= 2:
                worker_items = uls[1].query_selector_all("li")
                for item in worker_items:
                    ps = item.query_selector_all("p")
                    if len(ps) >= 3:
                        id_name = ps[0].inner_text().split(" - ")
                        days_line = ps[1].inner_text()
                        total_line = ps[2].inner_text()

                        worker_obj = {
                            "worker_id": id_name[0].strip(),
                            "name": id_name[1].strip() if len(id_name) > 1 else "",
                            "total_days": days_line.split("Days Worked:")[-1].split("|")[0].strip(),
                            "wage_per_day": days_line.split("Wage/Day:")[-1].replace("₹", "").strip(),
                            "total_amount": total_line.split("Total:")[-1].split("|")[0].replace("₹", "").strip(),
                            "paid_amount": total_line.split("Paid:")[-1].replace("₹", "").strip(),
                        }
                        work_obj["assigned_workers"].append(worker_obj)

            results.append(work_obj)

        browser.close()

        if given_work_id:
            return [work for work in results if work["work_id"] == given_work_id]
        return results


def get_mnrega_details(given_worker_id: str = '', given_work_id: str = ''):
    if given_work_id and given_worker_id:
        return {"error": "Enter only one either worker_id or work_id !"}

    # if work_id not mentioned and worker_id is provided, scrape worker details
    if given_worker_id and not given_work_id:
        return scrape_workers(given_worker_id=given_worker_id, url=env["MNREGA_API_URL"])

    # if work_id is provided, scrape work details
    if given_work_id and not given_worker_id:
        return scrape_works(given_work_id=given_work_id, url=env["MNREGA_API_URL"])

    # if both are not provided, scrape all works
    if not given_worker_id and not given_work_id:
        return scrape_works(given_work_id=given_work_id, url=env["MNREGA_API_URL"])
    
    return {"error": "Please provide either worker_id or work_id to scrape details."}


def get_groresponse_prompt(work_id, worker_id, grievanceDescription):
    user_details = get_mnrega_details(given_worker_id=worker_id, given_work_id=work_id)
    if not user_details:
        return f"No data found for MNREGA Case: {work_id} or Worker ID: {worker_id}"

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


@router.post("/get_gro_mnrega_response")
def get_mnrega_details_endpoint(inputData: QueryInput):
    mnrega_prompt = get_groresponse_prompt(
        work_id=inputData.work_id, 
        worker_id=inputData.worker_id, 
        grievanceDescription=inputData.grievanceDescription
    )
    return {"response": get_gro_response_by_llm(mnrega_prompt)}


