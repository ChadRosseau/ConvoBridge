"use client";

import { Conversation, Person } from "@/lib/translator";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Chat from "./chat";

const ConversationWrapper = () => {
  const params = useSearchParams();
  const p1Lang = params.get("p1Lang");
  const p2Lang = params.get("p2Lang");

  if (!p1Lang || !p2Lang) return <p>Languages not set</p>;

  const p1 = new Person(1, p1Lang);
  const p2 = new Person(2, p2Lang);

  const convoHandler: Conversation = new Conversation(p1, p2);

  return (
    <main className="flex min-h-screen bg-gradient-to-r from-teal-300 via-purple-300 to-teal-300 content-center justify-evenly">
      <div className="w-[49vw] h-[99vh] bg-zinc-100 rounded-3xl">
        <Chat convoHandler={convoHandler} person={p1}></Chat>
      </div>
      <div className="w-[49vw] h-[99vh] bg-zinc-100 rounded-3xl">
        <Chat convoHandler={convoHandler} person={p2}></Chat>
      </div>
    </main>
  );
};

export default ConversationWrapper;
