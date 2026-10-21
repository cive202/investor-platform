from pathlib import Path
from langchain_core.documents import Document
from langchain_experimental.text_splitter import SemanticChunker

def read_md_file(markdown_file : str) -> str:
    ''' Reads md file '''
    return Path(markdown_file).read_text(encoding="utf-8")

def chunk_markdown(markdown_file : str, embeddings) -> list[Document]:
    ''' Generate semenatic chunks from markdown
    Args:
        markdown_file path 
        Azure openAI embedding model
    Results:
         List of semenatic chunks
    '''
    markdown_content = read_md_file(markdown_file)
    chunker = SemanticChunker(embeddings)
    return chunker.create_documents([markdown_content])


if __name__ == "__main__":
    import os
    from dotenv import load_dotenv
    from langchain_openai import OpenAIEmbeddings

    load_dotenv(override=True)
    embedding_model_name = os.getenv("AZURE_EMBEDDING_MODEL_NAME")
    embedding_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    embedding_api_key = os.getenv("AZURE_OPENAI_API_KEY")

    if not embedding_endpoint or not embedding_api_key :
        raise RuntimeError("Missing Azure OpenAI endpoint or api_key")

    embeddings = OpenAIEmbeddings(
        model=embedding_model_name,
        base_url=embedding_endpoint,
        api_key=embedding_api_key,
        check_embedding_ctx_length=False,
    )
    md_file_path = "./data/output_md/2024_Tesla.md" 
    chunks = chunk_markdown(md_file_path,embeddings)

    print(f"Generated {len(chunks)} chunks \n")

    for i, chunk in enumerate(chunks, start=1):
        print(f"--- Chunk {i} ({len(chunk.page_content)} chars) ---")
        print(chunk.page_content.strip())
        if chunk.metadata:
            print(f"Metadata: {chunk.metadata}")
            print()




