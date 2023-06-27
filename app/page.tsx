"use client";

import { useState } from "react";
import { supportedLanguages } from "@/lib/db";
import Link from "next/link";
import { ArrowRightSquare } from "lucide-react";

const Home = () => {
  const [p1Lang, setP1Lang] = useState("English");
  const [p2Lang, setP2Lang] = useState("Finnish");

  const options1 = supportedLanguages.map((language) => (
    <option key={language} value={language} selected={language == p1Lang}>
      {language}
    </option>
  ));
  const options2 = supportedLanguages.map((language) => (
    <option key={language} value={language} selected={language == p2Lang}>
      {language}
    </option>
  ));

  return (
    <main className="flex min-h-screen items-center justify-center p-24 pb-60 bg-gradient-to-r from-teal-300 to-purple-300">
      <div className="bg-white p-14 pb-8 rounded-3xl">
        <h2 className="text-6xl text-center">Welcome</h2>
        <h4 className="text-3xl my-5 text-center">Choose your languages</h4>
        <div className="flex items-center justify-around w-full">
          <div>
            <select
              name="p1Language"
              id="p1Language"
              onChange={(e) => setP1Lang(e.target.value)}
              className="outline-none border-4 border-teal-300 rounded-md"
            >
              {options1}
            </select>
          </div>
          <div>
            <select
              name="p2Language"
              id="p2Language"
              onChange={(e) => setP2Lang(e.target.value)}
              className="outline-none border-4 border-purple-300 rounded-md"
            >
              {options2}
            </select>
          </div>
        </div>
        <Link
          href={{
            pathname: "/translator",
            query: {
              p1Lang,
              p2Lang,
            }, // the data
          }}
          className="mx-auto mt-4 w-fit block"
        >
          {/* <button className="block mx-auto mt-5 bg-gradient-to-r from-teal-300 to-purple-300 p-1 rounded-lg">
            <div className="bg-white w-full h-full rounded-lg text-2xl px-4 py-1">
              Begin
            </div>
          </button> */}
          <ArrowRightSquare size={48} strokeWidth={1} />
        </Link>
      </div>
    </main>
  );
};

export default Home;
