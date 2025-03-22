import React from "react";
import { jsxDecorator } from "storybook-addon-jsx";
import { withPropsTable } from "storybook-addon-react-docgen";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import { withSaladictPanel } from "@/_helpers/storybook";
import { WaveformBox } from "./WaveformBox";
import { action } from "@storybook/addon-actions";

export default {
  title: "Content Scripts|Dict Panel",

  decorators: [
    withPropsTable,
    jsxDecorator,
    withKnobs,
    (story) => (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        {story()}
      </div>
    ),
    withSaladictPanel({
      head: <style>{require("./WaveformBox.scss").toString()}</style>,
    }),
  ],

  parameters: {
    backgrounds: [
      { name: "Saladict", value: "#5caf9e", default: true },
      { name: "Black", value: "#000" },
    ],
  },
};

export const _WaveformBox = () => (
  <WaveformBox
    darkMode={boolean("Dark Mode", false)}
    isExpand={boolean("Expand", true)}
    toggleExpand={action("Toggle Expand")}
    onHeightChanged={action("Height Changed")}
  />
);

_WaveformBox.story = {
  name: "WaveformBox",
};
