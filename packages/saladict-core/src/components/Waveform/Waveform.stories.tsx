import React from "react";
import { jsxDecorator } from "storybook-addon-jsx";
import { withPropsTable } from "storybook-addon-react-docgen";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import {
  withSaladictPanel,
  withSideEffect,
  mockRuntimeMessage,
} from "@/_helpers/storybook";
import { Waveform } from "./Waveform";

export default {
  title: "Content Scripts|Dict Panel",

  decorators: [
    withPropsTable,
    jsxDecorator,
    withKnobs,
    withSaladictPanel({
      head: <style>{require("./Waveform.scss").toString()}</style>,
      height: "auto",
    }),
    withSideEffect(
      mockRuntimeMessage(async (message) => {
        switch (message.type as string) {
          case "PAGE_INFO":
            return {
              pageId: "page-id",
            };
          case "[[LAST_PLAY_AUDIO]]":
            return require("@sb/assets/shewalksinbeauty.mp3");
          default:
            break;
        }
      }),
    ),
  ],

  parameters: {
    backgrounds: [
      { name: "Saladict", value: "#5caf9e", default: true },
      { name: "Black", value: "#000" },
    ],
  },
};

export const _Waveform = () => {
  const darkMode = boolean("Dark Mode", true);

  return <Waveform darkMode={darkMode} />;
};
