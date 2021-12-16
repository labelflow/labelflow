FROM pytorch/pytorch:1.9.0-cuda10.2-cudnn7-runtime

RUN apt-get update \
 && apt-get install -y \
      build-essential \
      ffmpeg \
      libsm6 \
      libxext6 \
 && apt-get clean

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt


EXPOSE 5000

CMD ["python", "server.py"]
