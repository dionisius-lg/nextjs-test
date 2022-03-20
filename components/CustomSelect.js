import Select from "react-select";
import classnames from "classnames";

export default function CustomSelect({ optionSelect, onChangeValue, value, isError = false, isSmall = false }) {
    return (
        <Select
            options={optionSelect}
            onChange={(selected) => {
                onChangeValue(selected.value)
            }}
            value={optionSelect.filter((opt) => {
                return opt.value === value
            })}
            className={classnames({
                "is-invalid": isError
            })}
            styles={StyleSelectBox(isSmall, isError)}
            placeholder="Choose..."
        />
    )
}

const StyleSelectBox = (isSmall, isError) => {
    if (isSmall) {
        return {
            container:  (provided, state) => ({
                ...provided,
                padding: "0",
                border: "0",
                fontSize: "0.775rem",
            }),
            control: (provided, state) => ({
                ...provided,
                padding: "0.01rem 0.5rem",
                minHeight: "calc(1.5em + (0.5rem + 2px))",
                fontSize: "0.875rem",
                borderRadius: "0.2rem",
                borderColor: isError ? "#dc3545" : "#d8dbe0",
                boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
                transition: "background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                ":hover": {
                    borderColor: isError ? "#dc3545" : (state.isFocused ? "#66afe9" : "#d8dbe0"),
                    boxShadow: isError ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)" : ( state.isFocused ?
                        "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6)" : "inset 0 1px 1px rgba(0, 0, 0, 0.075)"
                    ),
                }
            }),
            valueContainer: (provided, state) => ({
                ...provided,
                padding: "0"
            }),
            dropdownIndicator: (provided, state) => ({
                ...provided,
                width: "16px",
                padding: "0",
                marginLeft: "5px"
            }),
        }
    }

    return {
        control: (provided, state) => ({
            ...provided,
            borderColor: isError ? "#dc3545" : "#d8dbe0",
            boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.075)",
            transition: "background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
            ":hover": {
                borderColor: isError ? "#dc3545" : (state.isFocused ? "#66afe9" : "#d8dbe0"),
                boxShadow: isError ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)" : ( state.isFocused ?
                    "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6)" : "inset 0 1px 1px rgba(0, 0, 0, 0.075)"
                ),
            }
        })
    }
}
