from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from schemas.description import GenerateRequest, RefineRequest

class TextGeneratorService:
    def __init__(self):
        self.llm = ChatOllama(
            model="llama3.2:1b",
            temperature=0.7,
        )
        
        self.prompt_template = ChatPromptTemplate.from_messages([
            ("system", "You are an expert LinkedIn content creator. Write engaging, professional, and viral content."),
            ("user", """
            Create a LinkedIn post based on the following details:
            
            Description/Role: {description}
            Target Audience: {audience}
            Tone: {tone}
            Length: {length}
            
            Requirements:
            {requirements}
            
            Write ONLY the content of the post.
            """)
        ])
        
        self.chain = self.prompt_template | self.llm | StrOutputParser()

    async def generate_description_stream(self, request: GenerateRequest):
        requirements = []
        if request.include_keywords:
            requirements.append("- Include relevant SEO keywords")
        if request.achievement_focused:
            requirements.append("- Focus heavily on quantifiable achievements and numbers")
            
        req_str = "\n".join(requirements) if requirements else "None"
        
        async for chunk in self.chain.astream({
            "description": request.description,
            "audience": request.audience,
            "tone": request.tone,
            "length": request.length,
            "requirements": req_str
        }):
            yield chunk

    def refine_description(self, request: RefineRequest) -> str:
        # Simulate refinement logic for now, or implement similar simple chain
        refined = f"{request.current_text}\n\n[Refinement Note: Added context based on '{request.instruction}']"
        return refined

text_generator = TextGeneratorService()
