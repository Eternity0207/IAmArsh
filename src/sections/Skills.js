import React from "react";
import { skills } from "../content_option";
import SectionHead from "./SectionHead";
import SkillsExplorer from "../components/SkillsExplorer";

export default function Skills() {
  const total = skills.reduce((n, s) => n + s.items.length, 0);
  return (
    <section id="skills" className="section" aria-label="Skills">
      <div className="container">
        <SectionHead
          index="04"
          label="Skills"
          title={`${total} tools,`}
          dim="each tied to real work."
          lead="Pick any skill to see exactly where I've used it — projects, roles, open source and case studies."
        />
        <div className="panel">
          <SkillsExplorer />
        </div>
      </div>
    </section>
  );
}
