import os
from dotenv import load_dotenv
load_dotenv(override=True)

from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(
    model=os.getenv("AZURE_EMBEDDING_MODEL_NAME"),   # text-embedding-ada-002
    base_url=os.getenv("AZURE_OPENAI_ENDPOINT"),     # ...openai.azure.com/openai/v1/
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    check_embedding_ctx_length=False,
)
