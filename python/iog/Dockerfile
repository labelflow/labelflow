FROM pytorch/pytorch:1.9.0-cuda10.2-cudnn7-runtime
RUN apt update
RUN apt install build-essential ffmpeg libsm6 libxext6 -y

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt


EXPOSE 5000

CMD ["python", "server.py"]