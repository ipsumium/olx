FROM python:latest
ENV PYTHONUNBUFFERED 1
RUN mkdir /nsolum
WORKDIR /nsolum
ADD requirements.txt /nsolum/
RUN pip install -r requirements.txt
ADD . /nsolum/