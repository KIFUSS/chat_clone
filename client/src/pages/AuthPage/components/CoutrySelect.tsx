import React from 'react'

interface CountrySelectProps {
    value: string;
    onChange: (newCode: string) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({value, onChange}) => {

    return (
        <div className="w-full relative mb-4">
          <select 
            onChange={(e) => onChange(e.target.value)}
            value={value}
            className="w-full bg-zinc-950 text-zinc-200 border border-zinc-800 px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer"
          >
            <option value="+7">Россия / Казахстан (+7)</option>
            <option value="+380">Украина (+380)</option>
            <option value="+375">Беларусь (+375)</option>
            <option value="+1">США (+1)</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-xs">▼</div>
        </div>
    )
}

export default CountrySelect;