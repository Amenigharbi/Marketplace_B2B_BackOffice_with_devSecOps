import type { Meta, StoryObj } from "@storybook/react";
//import Index from "./index";
const Index = () => <div />;

const meta = {
  title: "Elements/SidebarElements/SidebarSubMenu",
  component: Index,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Index>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
