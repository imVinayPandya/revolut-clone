import React from "react";
import { View, Text } from "react-native";
import * as DropDownMenu from "zeego/dropdown-menu";
import RoundButton from "./RoundButton";

const Dropdown = () => {
  return (
    <DropDownMenu.Root>
      <DropDownMenu.Trigger>
        <RoundButton text="More" icon="ellipsis-horizontal" />
      </DropDownMenu.Trigger>

      <DropDownMenu.Content>
        <DropDownMenu.Item key="statement">
          <DropDownMenu.ItemTitle>Statement</DropDownMenu.ItemTitle>
          <DropDownMenu.ItemIcon
            ios={{
              name: "list.bullet.rectangle.fill",
              pointSize: 24,
            }}
          />
        </DropDownMenu.Item>

        <DropDownMenu.Item key="converter">
          <DropDownMenu.ItemTitle>Converter</DropDownMenu.ItemTitle>
          <DropDownMenu.ItemIcon
            ios={{
              name: "coloncurrencysign.arrow.circlepath",
              pointSize: 24,
            }}
          />
        </DropDownMenu.Item>

        <DropDownMenu.Item key="background">
          <DropDownMenu.ItemTitle>Background</DropDownMenu.ItemTitle>
          <DropDownMenu.ItemIcon
            ios={{
              name: "photo.fill",
              pointSize: 24,
            }}
          />
        </DropDownMenu.Item>

        <DropDownMenu.Item key="account">
          <DropDownMenu.ItemTitle>Add new account</DropDownMenu.ItemTitle>
          <DropDownMenu.ItemIcon
            ios={{
              name: "plus.rectangle.fill.on.folder.fill",
              pointSize: 24,
            }}
          />
        </DropDownMenu.Item>
      </DropDownMenu.Content>
    </DropDownMenu.Root>
  );
};

export default Dropdown;
