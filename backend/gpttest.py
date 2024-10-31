# pip install -U openai
from openai import OpenAI

client = OpenAI(api_key='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')

response = client.chat.completions.create(
    model="gpt-3.5-turbo", # or gpt-4o-mini, claude-3-haiku, gemini-1.5-flash, etc...
    messages=[{"role": "user", "content": "Hello, AI!"}]
)

print(response.choices[0].message.content)