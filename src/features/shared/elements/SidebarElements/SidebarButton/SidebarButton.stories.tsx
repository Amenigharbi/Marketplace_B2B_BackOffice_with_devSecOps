import type { Meta, StoryObj } from "@storybook/react";
import Index from "./index";

const meta = {
  title: "Elements/SidebarElements/SidebarButton",
  component: Index,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Index>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { icon: <div />, isActive: false, name: "Test", onClick: () => {} },
};
