import { type PluginDefinition, createSchemaBuilder, zod } from "@alfons-app/pdk";
import { name } from "./package.json";
import { TimerRegular } from "@fluentui/react-icons";

const $ = createSchemaBuilder(name);

const Definition = {
  Icon: () => <TimerRegular />,
  schema: $.object({
    interval: $.number()
      .setupInspector({ control: "Numeric", label: "interval" })
      .default(0),
    onInterval: $.reference().setupInspector({
      category: "actions",
      sourcing: "reference",
      label: "onInterval",
    }),
    repeat: $.boolean().default(false).setupInspector({
      control: "Switch",
      label: "repeat",
    }),
    pause: $.boolean().default(false).setupInspector({
      control: "Switch",
      category: "control",
      label: "pauseButton",
    }),
    reset: $.boolean().default(false).setupInspector({
      control: "Switch",
      category: "control",
      label: "resetButton",
    })
  }),
  shouldAllowChild: () => () => false,
} satisfies PluginDefinition;

export default Definition;

export type TimerProps = zod.infer<typeof Definition.schema>;
