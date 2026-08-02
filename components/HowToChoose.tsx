import Link from "next/link";
import type { HowToStep } from "@/lib/types";

type Props = {
  steps: HowToStep[];
};

export default function HowToChoose({ steps }: Props) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8">
          <span className="bg-yellow-100 text-yellow-700 font-bold text-sm px-4 py-1 rounded-full">
            3ステップ
          </span>
          <h2 className="text-2xl font-black text-gray-800 mt-2">
            かんたん！回線のえらびかた
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="text-center">
              <div className={`${s.bgColor} rounded-3xl p-6`}>
                <div
                  className={`${s.stepColor} w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-base mx-auto mb-3`}
                >
                  {s.step}
                </div>
                <div className="text-4xl mb-3">{s.emoji}</div>
                <h3 className="font-black text-gray-800 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="/diagnosis"
            className="bg-sky-400 hover:bg-sky-500 text-white font-black px-8 py-4 rounded-full pop-btn inline-block text-lg transition-colors"
          >
            今すぐ診断する（無料）→
          </Link>
        </div>
      </div>
    </section>
  );
}
