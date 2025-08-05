import { Injectable, Inject } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

@Injectable()
export class AiService {
    private openai: OpenAI;

    constructor(
        private readonly configService: ConfigService,
    ) {
        const API_KEY: string = configService.get<string>("OPENAI_API_KEY");
        const configuration = { apiKey: API_KEY };
        this.openai = new OpenAI(configuration);
    }
    
    async systemPromptQuestion() {
        let systemPrompt =
            "소크라테스식 문답법으로 질문을 만들어보자.\n\n" +
            "넌 사용자의 친한 친구야. 말투는 무조건 친구 말투로 해.\n\n" +
            "사용자가 어떤 말을 하면, 그걸 바탕으로:\n" +
            "- 이전 대화 내용과 겹치지 않고\n" +
            "- 자연스럽게 더 깊은 생각으로 이어지고\n" +
            "- 다양한 어휘와 표현을 사용해서\n" +
            "- **서로 전혀 다른 관점에서** 질문을 1개 만들어야 해\n\n" +

            "❗중요:\n" +
            "- **질문은 하나같이 다르게 만들어야 해 (표현 겹치면 안 됨)**\n" +
            "- 절대 설명하지 마\n" +
            "- 질문만으로 스스로 생각하게 만들어야 해\n" +
            "- 각 질문은 **짧고 간결하게**, 반드시 **25자 이내**\n" +
            "- 응답은 무조건 JSON 배열 형식으로 해\n" +
            "- 정확히 이렇게만: [\"질문1?\", \"질문2?\", \"질문3?\", \"질문4?\", \"질문5?\"]\n" +
            "- '~해볼래?', '~말해줘', '~이야기해줄래?' 같은 **답변 유도 말투는 절대 쓰지 마**\n" +
            "- 표현이 비슷하거나 같은 뉘앙스는 하나만 쓰고, **반드시 각기 다른 주제/관점/구조로** 만들어\n\n" +
            "- 질문을 반드시 3개를 만들어줘\n" +
            "- 반말로 해줘\n" +
            "그럼 바로 시작해.\n";
            
        return systemPrompt;
    }

    async systemPromptQuestionSummary() {
        let systemPrompt = 
            "오늘의 질문들을 바탕으로 내가 어떤 생각을 했는지 일기처럼 정리해줘.\n\n" +
            "한국어로 반말을 사용하고, 문체는 부드럽고 자연스럽게 에세이처럼 써줘.\n\n" +
            "한 문장이 끝날 때마다 무조건 줄바꿈을 해줘.\n" +
            "줄바꿈은 줄 하나만 띄워서, \\n 한 번만 써줘. 절대로 \\n\\n처럼 두 줄 띄우지 마.\n\n" +
            "마침표(.), 느낌표(!), 물음표(?) 등으로 문장이 끝났을 때만 줄바꿈을 해줘.\n" +
            "문장이 끝나기 전에 줄을 바꾸지 말아줘.\n\n" +
            "**마지막 문장은 반드시 의문문 형식(물음표 ? 로 끝나는 질문)**으로 작성해줘.\n" +
            "예를 들어 '~일까?', '~어떻게 해야 할까?', '~좋을까?' 같은 느낌으로 끝내줘.\n\n" +
            "전체 글은 150자에서 230자 사이로 작성해줘.";

        return systemPrompt;
    }

    async systemPromptReplyMessageStatus() {
        let systemPrompt = 
            "이 글에 대한 감정을 설명 없이 위 하나의 숫자로만 얘기해줘" +
            "1. 답답함" +
            "2. 지루함" +
            "3. 장난기" +
            "4. 무기력함" +
            "5. 불안함" +
            "6. 스트레스" +
            "7. 서운함" +
            "8. 미안함"

        return systemPrompt;
    }

    async qbpDetailReturn() {
        let systemPrompt = 
            "나는 질문 기반 성향 프로파일링(QBP)을 개발 중이야." +
            " 이 프로파일은 사용자가 질문을 어떻게 해석하고, 반응하고, 표현하는지를 분석해서 성향을 16가지 유형 중 하나로 분류해." +
            "QBP는 4개의 축으로 구성돼 있고, 각 축에는 두 가지 대립 속성이 있어." +
            " 내가 주는 질문이 이 8가지 속성 중 어떤 성향을 더 강하게 자극하는지를 비율로 추정해줘." +
            "QBP 대립 축 구조:" +
            "E (Explorer): 외부를 탐색하고 질문을 통해 확장하려는 성향" +
            "I (Informer): 자기 내부를 정리하고 질문을 자기 정리에 활용하는 성향" +
            "F (Feel-type): 감정에 따라 반응하고 정서적 흐름에 민감하게 움직이는 성향" +
            "T (Think-type): 질문을 구조, 원인, 논리적으로 해석하려는 성향" +
            "P (Playful): 상상력, 유연한 해석, 드립, 여백을 즐기는 자유형" +
            "J (Judger): 구조화, 의미 정리, 철학적 사유를 선호하는 진지형" +
            "O (Outgoing): 질문에 즉각 반응하고 말이나 글로 표현하려는 성향" +
            "C (Contained): 질문을 조용히 곱씹고, 타인의 반응을 관찰하는 성향" +
            "분석 방식:" +
            "아래 질문이 이 8가지 항목 중 각각을 얼마나 자극하는지 퍼센트(%) 1 단위 정수로 평가해줘" +
            "총합은 반드시 100%가 되도록 정규화해줘" +
            "비율은 상대 강도를 반영해야 하며, 감정 중심 질문은 F, O, P 쪽 비중이 클 수 있음" +
            "응답 형식은 표 형태(E~C, %값)로 제공해줘. " + 
            "E~C 값이 무조건 있어야 해 이 규칙을 어겨선 안되." +
            "아래 질문이 1부터 10단계 중 몇단계인지 평가해줘" +
            "1단계 단순 호기심" +
            "2단계 행위의 이유와 목적, " +
            "3단계 가치 판단의 시작, " +
            "4단계 규범에 대한 의심, " +
            "5단계 인식에 대한 질문, " +
            "6단계 존재에 대한 물음, " +
            "7단계 자유와 의지에 대한 탐구, " +
            "8단계 삶과 죽음의 의미, " +
            "9단계 보편성과 절대성에 대한 회의, " +
            "10단계 존재론적·형이상학적 근원 탐구, " +
            "해당 되는 단계를 level: 질문에 대한 단계에 정수로 표시해줘" + 
            "❗중요:\n" +
            "무조건 parse 하기 좋은 json data 로 제공해줘 " +
            "json data 형식은 ` 없이 { E: , I: , F: , T: , P: , J: , O: , C: , level:  } 형태가 되도록 해줘" +
            "json data 에 ` 와 json 은 제거하고 제공해줘 " +
            "json data 의 key 에 \" 가 들어 가도록 제공해줘"
            // "`가 없이 제공해줘"

        return systemPrompt;
    }

    async personality_type_return(personality_type_message: string) {
        let test;
        try{
            const systemPrompt =  await this.qbpDetailReturn();
        
            const message = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: personality_type_message }
            ];
        
            let ret = await this.chat(message);
            
            console.log("=============== TRY ===============")
            console.log(personality_type_message);
            console.log("=====================================")
            JSON.parse(ret);

            return ret;
        }catch(e){
            console.log("=============== CATCH ===============")
            console.log(personality_type_message);
            console.log("=====================================")
            return await this.personality_type_return(personality_type_message);
        }
    }

    async getGptQuestionResponse(prompt: string, question: string) {
        try{
            const systemPrompt =  "질문: " + prompt;
        
            const message = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: question }
            ];
        
            let ret = await this.chat(message);

            return ret;
        }catch(e){
            return await this.getGptQuestionResponse(prompt, question);
        }
    }

    async chat(message: any) {
        const chatCompletion = await this.openai.chat.completions.create({
            messages: message,
            model: this.configService.get('OPENAI_API_MODEL'),
            temperature: 0.8,
        });
        return chatCompletion.choices[0].message.content;
    }

    async create_3_5_Completion(
        model: string,
        prompt: ChatCompletionMessageParam[],
        temperature: number,
        maxTokens: number,
    ): Promise<any> {
        try {
            const params: OpenAI.Chat.ChatCompletionCreateParams = {
                model,
                messages: prompt,
                temperature,
                max_tokens: maxTokens,
            };
            const completion = await this.openai.chat.completions.create(params);

            return completion.choices[0].message.content;
        } catch (err) {
            if (err instanceof OpenAI.APIError) {
                console.log(err.status);
                console.log(err.name);
                console.log(err.headers);
            } else {
                throw err;
            }
        }
    }

    async createEmbedding(model: string, input: string): Promise<number[]> {
        try {
            const response = await this.openai.embeddings.create({
                model: 'text-embedding-ada-002',
                input,
            });

            const embedding = response.data[0]?.embedding;

            return embedding;
        } catch (err) {
            if (err instanceof OpenAI.APIError) {
                console.log(err.status);
                console.log(err.name);
                console.log(err.headers);
            } else {
                throw err;
            }
        }
    }

    async getGptTypeReturn(question: string) {
        const ret =  await this.personality_type_return(question);

        // const message = [
        //     { role: 'system', content: systemPrompt },
        //     { role: 'user', content: question }
        // ];
    
        // let ret = await this.chat(message);

        return ret;
    }

    async getHashTag(content: string) {
        let systemPrompt = "해당 내용을 분석해서 해시 태그 3개를 만들어줘.\n\n" +
            "해시 태그는 반드시 #으로 시작하고, 공백 없이 이어져야 해.\n" +
            "예를 들어: [\"#해시태그1\", \"#해시태그2\", \"#해시태그3\"]\n\n" +
            "출력은 반드시 배열(Array) 형식으로 해줘. 문자열이 아니라 배열이어야 해.\n" +
            "반드시 3개의 해시태그를 포함해야 해.\n\n" +
            "[출력형식]\n" +
            "[\"#해시태그1\", \"#해시태그2\", \"#해시태그3\"]";
            
        try{        
            const message = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: content }
            ];
            console.log(content);
            let ret = await this.chat(message);
            console.log(ret);
            return ret;
        }catch(e){
            return await this.getHashTag(content);
        }

    }
}
