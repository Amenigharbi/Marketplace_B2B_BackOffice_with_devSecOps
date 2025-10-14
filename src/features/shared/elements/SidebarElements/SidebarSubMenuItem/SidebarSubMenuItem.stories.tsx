import type { Meta, StoryObj } from "@storybook/react";
import Index from "./index";

const meta = {
  title: "Elements/SidebarElements/SidebarSubMenuItem",
  component: Index,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Index>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Active: Story = { args: { isActive: true } };
