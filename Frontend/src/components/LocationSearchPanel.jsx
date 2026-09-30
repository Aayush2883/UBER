import React from 'react'

const LocationSearchPanel = ({ suggestions = [], setPanelOpen, setPickup, setDestination, activeField }) => {

    const handleSuggestionClick = (suggestion) => {
        // suggestion is { label, sublabel, full } — use full as the actual address value
        const value = suggestion.full || suggestion.label || suggestion
        if (activeField === 'pickup') {
            setPickup(value)
        } else if (activeField === 'destination') {
            setDestination(value)
        }
        setPanelOpen(false)
    }

    if (!suggestions || suggestions.length === 0) {
        return (
            <div className='py-6 text-center text-sm text-gray-400'>
                <i className="ri-search-line text-2xl text-gray-300 block mb-2"></i>
                Type an address to see suggestions...
            </div>
        )
    }

    return (
        <div className='space-y-1.5 py-1'>
            {suggestions.map((elem, idx) => {
                // Support both structured { label, sublabel, full } and plain strings (backward compat)
                const isStructured = typeof elem === 'object' && elem !== null
                const label    = isStructured ? elem.label    : elem
                const sublabel = isStructured ? elem.sublabel : ''

                return (
                    <div
                        key={idx}
                        onClick={() => handleSuggestionClick(elem)}
                        className='flex gap-3 border border-gray-100 hover:border-gray-300 active:border-black p-3 rounded-xl items-center cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors'
                    >
                        <div className='bg-[#eee] h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full text-gray-600'>
                            <i className="ri-map-pin-2-fill text-base"></i>
                        </div>
                        <div className='overflow-hidden text-left flex-1 min-w-0'>
                            <h4 className='font-semibold text-sm text-gray-900 truncate leading-snug'>{label}</h4>
                            {sublabel ? (
                                <p className='text-xs text-gray-500 truncate mt-0.5 leading-snug'>{sublabel}</p>
                            ) : null}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default LocationSearchPanel