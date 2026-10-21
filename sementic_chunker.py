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

