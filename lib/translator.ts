import { Configuration, OpenAIApi } from "openai";
import { Dispatch, SetStateAction } from "react";
import ISO from "iso-639-1"

export var languages = ["English", "Finnish", "Swedish"];

export class Person {
    id: number;
    language: string;
    conversation: Message[];

    constructor(id: number, language: string) {
        this.id = id;
        this.language = language;
        this.conversation = [];
    }
}

export interface Message {
    person: Person,
    text: string
}

class CustomFormData extends FormData {
    getHeaders() { return {} }
}

export class Translator {
    openai: OpenAIApi;

    constructor() {
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
            formDataCtor: CustomFormData,
        });
        this.openai = new OpenAIApi(configuration);
    }

    public async translate(audioBlob: Blob, sourceLanguage: string, targetLanguage: string) {
        const audioFile = this.convertBlobToFile(audioBlob);
        const transcription = await this.transcribeAudio(audioFile, sourceLanguage);
        const translation = await this.translateTranscription(transcription, targetLanguage);
        return translation;
    }

    public async transcribe(audioBlob: Blob, sourceLanguage: string) {
        const audioFile = this.convertBlobToFile(audioBlob);
        const transcription = await this.transcribeAudio(audioFile, sourceLanguage);
        return transcription;
    }

    private convertBlobToFile(audioBlob: Blob): File {
        const audio = new File(
            [audioBlob],
            'audio.mp3',
            { type: 'audio/mp3' },
        );
        return audio;
    }

    private async transcribeAudio(audioFile: File, sourceLanguage: string): Promise<string> {
        const lang = ISO.getCode(sourceLanguage);
        const resp = await this.openai.createTranscription(audioFile, "whisper-1", undefined, undefined, undefined, lang);
        return resp['data']['text'];
    }

    public async translateTranscription(text: string, targetLanguage: string): Promise<string> {
        const completion = await this.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ "role": "user", "content": `Translate the following passage into ${targetLanguage}: ${text}` }],
        });
        return completion.data.choices[0].message?.content || "Translation failed";
    }
}

export class Conversation {
    translator: Translator = new Translator();
    currentAudio: Blob | null = null;

    p1: Person;
    p2: Person;

    p1Updater: Dispatch<SetStateAction<Message[]>> | null = null;
    p2Updater: Dispatch<SetStateAction<Message[]>> | null = null;

    constructor(p1: Person, p2: Person) {
        this.p1 = p1;
        this.p2 = p2;
    }

    public setUpdater(person: Person, updater: Dispatch<SetStateAction<Message[]>>) {
        person == this.p1 ? this.p1Updater = updater : this.p2Updater = updater;
    }

    public setAudio(audio: Blob) {
        this.currentAudio = audio;
    }

    public removeAudio() {
        this.currentAudio = null;
    }

    public async say(source: Person) {
        console.count();
        if (!this.currentAudio || !this.p1Updater || !this.p2Updater) return;
        const target = source == this.p1 ? this.p2 : this.p1;

        console.count();

        const text = await this.translator.transcribe(this.currentAudio, source.language);
        source.conversation = [...source.conversation, { person: source, text: text }];
        this.p1Updater(this.p1.conversation);
        this.p2Updater(this.p2.conversation);

        console.count();

        const translated = await this.translator.translateTranscription(text, target.language);
        target.conversation = [...target.conversation, { person: source, text: translated }];
        this.p1Updater(this.p1.conversation);
        this.p2Updater(this.p2.conversation);

        console.count();
    }

    public testData() {
        this.p1.conversation = [
            {
                person: this.p1,
                text: "Hi there"
            },
            {
                person: this.p2,
                text: "How are you doing"
            },
            {
                person: this.p1,
                text: "Good thanks, how are you"
            },
            {
                person: this.p2,
                text: "Good thanks"
            },
            {
                person: this.p1,
                text: "Hi there"
            },
            {
                person: this.p2,
                text: "How are you doing"
            },
            {
                person: this.p1,
                text: "Good thanks, how are you"
            },
            {
                person: this.p2,
                text: "Good thanks"
            },
            {
                person: this.p1,
                text: "Hi there"
            },
            {
                person: this.p2,
                text: "How are you doing"
            },
            {
                person: this.p1,
                text: "Good thanks, how are you"
            },
            {
                person: this.p2,
                text: "Good thanks"
            }
        ];

        this.p2.conversation = [
            {
                person: this.p1,
                text: "Goeie more"
            },
            {
                person: this.p2,
                text: "Hoe gaan dit"
            },
            {
                person: this.p1,
                text: "Goed dankie en jy"
            },
            {
                person: this.p2,
                text: "Goed dankie"
            },
            {
                person: this.p1,
                text: "Goeie more"
            },
            {
                person: this.p2,
                text: "Hoe gaan dit"
            },
            {
                person: this.p1,
                text: "Goed dankie en jy"
            },
            {
                person: this.p2,
                text: "Goed dankie"
            },
            {
                person: this.p1,
                text: "Goeie more"
            },
            {
                person: this.p2,
                text: "Hoe gaan dit"
            },
            {
                person: this.p1,
                text: "Goed dankie en jy"
            },
            {
                person: this.p2,
                text: "Goed dankie"
            }
        ]

        if (!this.p1Updater || !this.p2Updater) return;
        this.p1Updater(this.p1.conversation);
        this.p2Updater(this.p2.conversation);
    }

}