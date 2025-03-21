import React from "react";
import { Subject } from "rxjs";
import faker from "faker";
import { action } from "@storybook/addon-actions";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import { jsxDecorator } from "storybook-addon-jsx";
import { withPropsTable } from "storybook-addon-react-docgen";
import {
  withSaladictPanel,
  withi18nNS,
  withSideEffect,
  mockRuntimeMessage,
} from "@/_helpers/storybook";
import { DictItemHead } from "@/content/components/DictItem/DictItemHead";
import { MachineTrans } from "./MachineTrans";
import { machineResult } from "./engine";

export default {
  title: "Content Scripts|Components",

  decorators: [
    withPropsTable,
    jsxDecorator,
    withKnobs,
    withSideEffect(
      mockRuntimeMessage(async (message) => {
        action(message.type)(message.payload);
      }),
    ),
    withSaladictPanel({
      head: (
        <style>
          {require("./MachineTrans.scss").toString()}
          {require("@/components/Speaker/Speaker.scss").toString()}
          {require("@/content/components/DictItem/DictItemHead.scss").toString()}
        </style>
      ),
    }),
    withi18nNS(["content", "langcode"]),
  ],
};

export const _MachineTrans = () => {
  const rtl = boolean("rtl", true);
  return (
    <MachineTrans
      result={{
        id: "baidu",
        sl: "en",
        tl: rtl ? "ara" : "zh",
        slInitial: "collapse",
        searchText: {
          paragraphs: [faker.lorem.paragraph()],
          tts: faker.internet.url(),
        },
        trans: {
          paragraphs: [faker.lorem.paragraph()],
          tts: faker.internet.url(),
        },
      }}
      searchText={action("Search Text")}
      catalogSelect$={new Subject()}
    />
  );
};

_MachineTrans.story = {
  name: "MachineTrans",
};

export const MachineTransCatalog = () => {
  const rtl = boolean("rtl", false);
  const noop = () => {};
  const catalogSelect$ = new Subject<{ key: string; value: string }>();
  const mt = machineResult(
    {
      result: {
        id: "google",
        sl: rtl ? "ara" : "en",
        tl: "zh",
        slInitial: "hide",
        searchText: {
          paragraphs: [faker.lorem.paragraph()],
          tts: faker.internet.url(),
        },
        trans: {
          paragraphs: [faker.lorem.paragraph()],
          tts: faker.internet.url(),
        },
      },
    },
    ["zh", "cht", "en"],
  );
  return (
    <>
      <DictItemHead
        dictID={mt.result.id}
        isSearching={false}
        toggleFold={noop}
        openDictSrcPage={noop}
        onCatalogSelect={(v) => catalogSelect$.next(v)}
        catalog={mt.catalog}
      />
      <MachineTrans
        result={mt.result}
        searchText={action("Search Text")}
        catalogSelect$={catalogSelect$}
      />
    </>
  );
};

MachineTransCatalog.story = {
  name: "MachineTransCatalog",
};
