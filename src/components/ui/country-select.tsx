import type React from "react";
import Select from "react-select";
import { countries } from "countries-list";

interface CountrySelectProps {
	value?: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
	isDisabled?: boolean;
}

const countryOptions = Object.entries(countries).map(([, country]) => ({
	value: country.name,
	label: country.name,
}));

// Sort countries alphabetically
countryOptions.sort((a, b) => a.label.localeCompare(b.label));

const CountrySelect: React.FC<CountrySelectProps> = ({
	value,
	onChange,
	placeholder = "Select country",
	className,
	isDisabled = false,
}) => {
	return (
		<Select
			options={countryOptions}
			value={countryOptions.find((option) => option.value === value)}
			onChange={(option) => onChange(option?.value || "")}
			placeholder={placeholder}
			isDisabled={isDisabled}
			className={className}
			classNamePrefix="country-select"
			styles={{
				control: (base) => ({
					...base,
					minHeight: "42px",
					borderRadius: "0.375rem",
					borderColor: "rgb(209 213 219)",
					"&:hover": {
						borderColor: "rgb(156 163 175)",
					},
				}),
				option: (base, state) => ({
					...base,
					backgroundColor: state.isSelected
						? "rgb(59 130 246)"
						: state.isFocused
							? "rgb(219 234 254)"
							: "white",
					color: state.isSelected ? "white" : "black",
					"&:hover": {
						backgroundColor: state.isSelected
							? "rgb(37 99 235)"
							: "rgb(219 234 254)",
					},
				}),
			}}
		/>
	);
};

export default CountrySelect;
