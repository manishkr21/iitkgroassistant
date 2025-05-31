# Configuration
APP_MODULE = main:app
HOST = 0.0.0.0
PORT = 5002
RELOAD = --reload


.PHONY: run
run:
	test -d venv || python3 -m venv venv && \
	. venv/bin/activate && \
	venv/bin/pip install --upgrade pip && \
	venv/bin/pip install -r requirements.txt && \
	uvicorn $(APP_MODULE) --host $(HOST) --port $(PORT) $(RELOAD)


.PHONY: rmenv
remove-env:
	rm -rf .venv