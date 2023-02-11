import React, { useState } from "react";
import { messageService } from "../Functions/messageService";
import BasicDetails from "./ProfileRoutes/BasicDetails";
import Security from "./ProfileRoutes/Security";

export type ProfileProps = {
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePhoto: any;
  };
};

const Profile = (props: ProfileProps) => {
  const { profile } = props;
  const sectionArr = ["General", "Security"];
  const [section, setSection] = useState(
    sectionArr.map((i: string, idx: number) => {
      if (idx === 0) {
        return { id: idx, type: i, active: true };
      }
      return { id: idx, type: i, active: false };
    })
  );
  const sectionSelect = (id: number) => {
    setSection(
      section.map((v: any, idx: number) => {
        if (id === idx) {
          return { ...v, active: true };
        }
        return { ...v, active: false };
      })
    );
  };
  const Logout = () => {
    messageService?.sendMessage(
      "profile-page",
      // @ts-ignore
      { action: "logout" },
      "global"
    );
  };

  const SectionRender = () => {
    let active: number = NaN;
    section?.map((i: any) => {
      if (i?.active) {
        active = i?.id;
      }
    });
    switch (active) {
      case 0:
        return <BasicDetails profile={profile} />;
        break;
      case 1:
        return <Security />;
        break;
      default:
        break;
    }
  };

  return (
    <div className="profile-screen">
      <div className="left-col">
        {section?.map((i: any, idx: number) => (
          <div
            key={`profile-section-${idx}`}
            className={`section ${i?.active ? "active" : ""}`}
            onClick={() => {
              sectionSelect(i?.id);
            }}
          >
            {i?.type}
          </div>
        ))}
        <div className="logout-container">
          <button type="button" className="logout" onClick={Logout}>
            Log out
          </button>
        </div>
      </div>
      <div className="right-col">{SectionRender()}</div>
    </div>
  );
};

export default Profile;
