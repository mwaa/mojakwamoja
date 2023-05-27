FROM python:3.8-slim-buster
# upgrade pip
RUN pip install --upgrade pip

RUN apt-get update && apt-get install -y build-essential libsndfile1 ffmpeg

# copy all the files to the container
COPY . .

RUN export FLASK_APP=app.py
RUN pip install -r requirements.txt

# define the port number the container should expose
EXPOSE 5000

CMD gunicorn --worker-tmp-dir /dev/shm --config gunicorn_config.py app:app