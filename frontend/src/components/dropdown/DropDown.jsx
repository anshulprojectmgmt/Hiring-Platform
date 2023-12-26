import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import '../dropdown/DropDown';
import { useDispatch, useSelector } from "react-redux";
import ButtonGroup from 'react-bootstrap/ButtonGroup';


const DropDown = ({ dropDownOptions, dropDownName, dropDownAction }) => {
  const value = useSelector((state) => state.editorTheme[dropDownName]);
  const dispatch = useDispatch();
  const handleSelect = (e) => {
    dispatch( {type: dropDownAction, payload:e});
  }
  return (
    <DropdownButton variant="light"  size="sm" id="dropdown-basic-button" title={value} onSelect={handleSelect} >
      {dropDownOptions.map((option) => {
        return (
          <Dropdown.Item
            key={option}
            eventKey={option}
          >
            {option}
          </Dropdown.Item>
        );
      })}
    </DropdownButton>
  );
};

export default DropDown;
