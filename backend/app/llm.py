from langchain.llms import OpenAI, HuggingFaceHub
from typing import Any, List
import openai
from huggingface_hub import HfApi
from openai.pagination import SyncPage
from openai.types import Model

from app.config import init_config

config = init_config()


def get_llm(model_name: str) -> Any:
    """
    Returns a LangChain LLM instance based on the model name.
    Supports OpenAI and HuggingFaceHub models.
    """
    if model_name in ["gpt-3.5-turbo", "gpt-4"]:
        return OpenAI(model_name=model_name, openai_api_key=config.OPENAI_API_KEY)
    elif model_name.startswith("llama") or model_name.startswith("meta"):
        return HuggingFaceHub(repo_id=model_name, huggingfacehub_api_token=config.HUGGINGFACEHUB_API_TOKEN)
    else:
        raise ValueError(f"Unknown or unsupported model: {model_name}")

def get_openai_models() -> List[str]:
    if not config.OPENAI_API_KEY:
        print(f"OPENAI_API_KEY is not set")
        return []
    openai.api_key = config.OPENAI_API_KEY
    try:
        result: SyncPage[Model] = openai.models.list()
        print(f"OpenAI models: {result}")
        return [m.id for m in result.data]
    except Exception:
        return []

def get_huggingface_models() -> List[str]:
    if not config.HUGGINGFACEHUB_API_TOKEN:
        print(f"HUGGINGFACEHUB_API_TOKEN is not set")
        return []
    api = HfApi(token=config.HUGGINGFACEHUB_API_TOKEN)
    try:
        models = api.list_models(author="meta")
        return [m.modelId for m in models if "llama" in m.modelId.lower()]
    except Exception:
        return []

def get_all_models() -> List[str]:
    return get_openai_models() + get_huggingface_models()
