import React from "react";
import { metaUrlGenerate } from "../Functions/util";

type GridSectionProps = {
  name: String;
  sections: {
    sectionName1: String;
    sectionName2: String;
    sectionName3: String;
    sectionName4: String;
    sectionName5: String;
    sectionName6: String;
    sectionPhoto1: any;
    sectionPhoto2: any;
    sectionPhoto3: any;
    sectionPhoto4: any;
    sectionPhoto5: any;
    sectionPhoto6: any;
  };
};

const GridSection = (props: GridSectionProps) => {
  const { name, sections } = props;
  const gridArray = [
    { name: sections.sectionName1, image: sections.sectionPhoto1, area: "a" },
    { name: sections.sectionName2, image: sections.sectionPhoto2, area: "b" },
    { name: sections.sectionName3, image: sections.sectionPhoto3, area: "c" },
    { name: sections.sectionName4, image: sections.sectionPhoto4, area: "d" },
    { name: sections.sectionName5, image: sections.sectionPhoto5, area: "e" },
    { name: sections.sectionName6, image: sections.sectionPhoto6, area: "f" },
  ];
  return (
    <div className="category-grid-section">
      <div className="category-grid-name">{name}</div>
      <div className="category-grid">
        {gridArray?.map((i) => (
          <a
            // @ts-ignore
            href={`/catagory/${metaUrlGenerate(i?.name)}`}
            target="_blank"
            rel="norefferer"
            className={`category-grid-area category-grid-area-${i?.area}`}
            style={{ backgroundImage: `url(${i?.image})` }}
          >
            <div className="grid-item-name">{i?.name}</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GridSection;
