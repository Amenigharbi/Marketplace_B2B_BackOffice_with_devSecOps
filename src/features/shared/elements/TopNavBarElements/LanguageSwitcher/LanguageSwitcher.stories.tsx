import type { Meta, StoryObj } from "@storybook/react";
//import Index from "./LanguageSwitcher";
const Index = () => <div />;

const meta = {
  title: "Elements/TopNavBarElements/LanguageSwticher",
  component: Index,
  decorators: [],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Index>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
