import React from "react";
import classNames from "classnames";
import { action } from "@storybook/addon-actions";
import { jsxDecorator } from "storybook-addon-jsx";
import { withPropsTable } from "storybook-addon-react-docgen";
import { withKnobs, boolean, number, text } from "@storybook/addon-knobs";
import { WordEditorPanel } from "./WordEditorPanel";
import {
  withLocalStyle,
  withSideEffect,
  mockRuntimeMessage,
  withi18nNS,
} from "@/_helpers/storybook";
import faker from "faker";

export default {
  title: "Content Scripts|WordEditor",

  decorators: [
    withPropsTable,
    jsxDecorator,
    withKnobs,
    withSideEffect(
      mockRuntimeMessage(async (message) => {
        action(message.type)(message.payload);
      }),
    ),
    withi18nNS(["common", "content"]),
  ],
};

export const _WordEditorPanel = () => {
  const darkMode = boolean("Dark Mode", false);

  return (
    <div className={classNames({ darkMode })}>
      <div
        className="saladict-theme"
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "20px 0",
        }}
      >
        <WordEditorPanel
          containerWidth={number("Panel X", 450 + 100)}
          btns={
            boolean("With Buttons", true)
              ? [
                  {
                    type: "normal",
                    title: "Normal Button",
                    onClick: action("Normal button clicked"),
                  },
                  {
                    type: "primary",
                    title: "Primary Button",
                    onClick: action("Primary button clicked"),
                  },
                ]
              : undefined
          }
          title={text("Title", faker.random.word())}
          onClose={action("Close")}
        >
          <div style={{ padding: 10 }}>
            {text("Content", faker.lorem.paragraphs())
              .split("\n")
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>
        </WordEditorPanel>
      </div>
    </div>
  );
};

_WordEditorPanel.story = {
  name: "WordEditorPanel",

  parameters: {
    jsx: { skip: 1 },
  },

  decorators: [
    withLocalStyle(require("./WordEditorPanel.scss")),
    withLocalStyle(require("@/_sass_shared/_theme.scss")),
  ],
};
