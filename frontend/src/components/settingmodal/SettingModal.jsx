import React from "react";
import DropDown from "../dropdown/DropDown";
import './SettingModal.css'

const SettingModal = () => {
  return (
    <div
      className="modal fade"
      id="exampleModal"
      // tabindex="-1"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Code Editor Settings
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
          <SettingOption
              dropDownName="theme"
              dropDownAction="CHANGE_THEME"
              optionName="Theme Options"
              optionDescription={
                "Tired of the white background? Try different styles and syntax highlighting."
              }
              dropDownOptions={["vs-dark", "vs-light", "hc-black"]}
            />
            <hr />
            <SettingOption
              dropDownName="fontSize"
              dropDownAction="CHANGE_FONT_SIZE"
              optionName="Font Size"
              optionDescription={
                "Tired of small/large text?? Try different font size"
              }
              dropDownOptions={["14px", "16px", "18px", "20px"]}
            />

          </div>
          
        </div>
      </div>
    </div>
  );
};

const SettingOption = ({
    optionName,
    optionDescription,
    dropDownOptions,
    dropDownName,
    dropDownAction,
  }) => {
    return (
      <div className="setting_option">
        <div className="setting_option_data">
          <h5>{optionName}</h5>
  
          <p className="me-2" >{optionDescription}</p>
        </div>
        <hr />
        {/* <DropDown /> */}
        <DropDown
          dropDownName={dropDownName}
          dropDownAction={dropDownAction}
          dropDownOptions={dropDownOptions}
        />
      </div>
    );
  };

export default SettingModal;
