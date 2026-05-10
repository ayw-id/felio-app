import type { Meta, StoryObj } from "@storybook/vue3";

import Accordion from "./Accordion.vue";

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction

const meta = {
  title: "Test/Accordion",
  component: Accordion,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    accordion: {
      title: "AAAA",
      description: "aaaaa",
    },
  },
};

export const Test1: Story = {
  args: {
    accordion: {
      ...Default.args.accordion,
      description: "aaaa1",
    },
  },
};

export const Test2: Story = {
  args: {
    accordion: {
      ...Default.args.accordion,
      title: "AAAA1",
    },
  },
};
