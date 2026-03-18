"use client";

import { useState } from "react";
import { useMentor } from "../mentor-context";
import { CvRichEditor } from "../../shared/ui/CvRichEditor";
import { Button } from "../../shared/ui/Button";

export default function MyCvPage() {
  const { cv, setCv } = useMentor();
  const [draftHtml, setDraftHtml] = useState<string>(cv?.contentHtml ?? "");
  const [fileName, setFileName] = useState<string | undefined>(
    cv?.uploadedFileName
  );

  const handleSave = () => {
    setCv({
      contentHtml: draftHtml,
      uploadedFileName: fileName,
    });
  };

  return (
    <section className="flex w-full flex-col gap-4">
      <header className="sticky top-0 z-50 flex flex-col border-b border-white/70 bg-white">
        <h1 className="text-[30px] font-semibold text-zinc-950">My CV</h1>
      </header>

      <div className="flex flex-col">

          <CvRichEditor valueHtml={draftHtml} onChangeHtml={setDraftHtml} classToolbar="!top-11" />
          <p className="text-[11px] text-zinc-500">
            Tip: Include key skills, technologies, and achievements. The ranking
            engine uses this text to compare with vacancies.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={handleSave}
            appearance="primary"
          >
            Save CV
          </Button>
        </div>
    </section>
  );
}

