import React from 'react'

const LocationSearchPanel = ({ suggestions = [], setPanelOpen, setPickup, setDestination, activeField }) => {

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
        } else if (activeField === 'destination') {
            setDestination(suggestion)
        }
        setPanelOpen(false)
    }

    if (!suggestions || suggestions.length === 0) {
        return (
            <div className='py-4 text-center text-sm text-gray-400'>
                Type an address to see suggestions...
            </div>
        )
    }

    return (
        <div className='space-y-2 py-1'>
            {suggestions.map((elem, idx) => (
                <div
                    key={idx}
                    onClick={() => handleSuggestionClick(elem)}
                    className='flex gap-3.5 border border-gray-100 hover:border-gray-300 active:border-black p-3 rounded-xl items-center justify-start cursor-pointer hover:bg-gray-50 transition-colors'
                >
                    <div className='bg-[#eee] h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-full text-gray-700'>
                        <i className="ri-map-pin-2-fill text-base"></i>
                    </div>
                    <div className='overflow-hidden text-left'>
                        <h4 className='font-medium text-sm text-gray-800 truncate'>{elem}</h4>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default LocationSearchPanel