# pip install -U openai
from openai import OpenAI

client = OpenAI(api_key='')

response = client.chat.completions.create(
    model="gpt-3.5-turbo", # or gpt-4o-mini, claude-3-haiku, gemini-1.5-flash, etc...
    messages=[{"role": "user", "content": "Hello, AI!"}]
)

print(response.choices[0].message.content)