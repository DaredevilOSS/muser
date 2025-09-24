import os
from dotenv import load_dotenv
from typing import Optional


class Config:
    OPENAI_API_KEY: Optional[str] = None
    HUGGINGFACEHUB_API_TOKEN: Optional[str] = None

config: Optional[Config] = None


def init_config() -> Config:
    global config
    if config:
        return config

    load_dotenv()

    config = Config()
    config.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    config.HUGGINGFACEHUB_API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")

    return config
