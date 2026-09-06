'use client'

import { bathsOptions, bedsOptions, propertyTypeOptions, priceOptions, sortOptions } from "@/lib/constants";
import DropDown from "./DropDown";
import SearchBar from "./SearchBar";

export default function FilterMethods() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1fr] gap-3 p-4 md:p-6 lg:p-10 lg:pb-5 md:pb-5">
        <SearchBar/>
        <div className="grid  grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
            <DropDown filterKey="sort" placeholder="Sort" options={sortOptions} />
            <DropDown filterKey="price" placeholder="Price" options={priceOptions} />
            <DropDown filterKey="beds" placeholder="Beds" options={bedsOptions} />
            <DropDown filterKey="baths" placeholder="Baths" options={bathsOptions} />
            <div className="col-span-2 sm:col-span-1 xl:col-span-1">
                <DropDown filterKey="homeType" placeholder="Home Type" options={propertyTypeOptions} />
            </div>
        </div>
    </div>
  );
}