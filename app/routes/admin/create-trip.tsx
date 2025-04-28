import { Header } from '@/components';
import { comboBoxItems, selectItems } from '@/constants';
import { cn, formatKey } from '@/lib/utils';
import {
    ComboBoxComponent,
    type FilteringEventArgs,
} from '@syncfusion/ej2-react-dropdowns';
import {
    LayerDirective,
    LayersDirective,
    MapsComponent,
} from '@syncfusion/ej2-react-maps';
import { useState, type FormEvent } from 'react';
import type { Route } from './+types/create-trip';
import { world_map } from '@/constants/world_map';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { account } from '@/appwrite/client';
import { useNavigate } from 'react-router';

export const loader = async () => {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    return data.map((country: unknown) => ({
        name: country.flag + country.name.common,
        coordinates: country.latlng,
        value: country.name.common,
        openStreetMap: country.maps?.openStreetMap,
    })) as Array<Country>;
};

const CreateTrip = ({ loaderData: countries }: Route.ComponentProps) => {
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<TripFormData>({
        country: countries[0]?.name || '',
        travelStyle: '',
        budget: '',
        duration: 0,
        groupType: '',
        interest: '',
    });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const countryData = countries?.map(country => ({
        text: country.name,
        value: country.value,
    }));

    const mapData = [
        {
            country: formData.country,
            color: '#EA382E',
            coordinate: countries.find(
                (c: Country) => c.name === formData.country,
            )?.coordinates,
        },
    ];

    const handleChange = (key: keyof TripFormData, value: string | number) => {
        setFormData(_prev => ({
            ..._prev,
            [key]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        const _formDataValues = Object.values(formData);
        if (_formDataValues.some(_v => !_v)) {
            setError('Please provide all the values');
            setLoading(false);
            return;
        }

        if (formData.duration < 1 || formData.duration > 10) {
            setError('Duration must be between 1 and 10 days');
            setLoading(false);
            return;
        }

        const user = await account.get();
        if (!user.$id) {
            console.error('User not authenticated');
            setLoading(false);
            return;
        }

        try {
            console.group('createTripHandleSubmit');
            console.log('user: ', user);
            console.log('formData: ', formData);
            console.groupEnd();

            const response = await fetch('/api/create-trip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    country: formData.country,
                    numberOfDays: formData.duration,
                    travelStyle: formData.travelStyle,
                    interests: formData.interest,
                    budget: formData.budget,
                    groupType: formData.groupType,
                    userId: user.$id,
                }),
            });
            const result: CreateTripResponse = await response.json();

            if (result?.id) {
                navigate(`/trips/${result.id}`);
            } else {
                console.error('failed to generate a trip');
            }
        } catch (error) {
            console.error('Error generating trip: ', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header
                title="Add a New Trip"
                description="View and edit AI Generated travel plans"
            />
            <section className="mt-2 5 wrapper-md">
                <form className="trip-form" onSubmit={handleSubmit}>
                    <div className="">
                        <label htmlFor="country">Country</label>
                        <ComboBoxComponent
                            id={'country'}
                            dataSource={countryData}
                            fields={{ text: 'text', value: 'value' }}
                            placeholder="Select a Country"
                            className="combo-box"
                            change={(e: { value: string | undefined }) => {
                                if (e.value) {
                                    handleChange('country', e.value);
                                }
                            }}
                            allowFiltering={true}
                            filtering={(e: FilteringEventArgs) => {
                                const query = e.text.toLowerCase();
                                e.updateData(
                                    countries
                                        .filter(country =>
                                            country.name
                                                .toLowerCase()
                                                .includes(query),
                                        )
                                        .map(country => ({
                                            text: country.name,
                                            value: country.value,
                                        })),
                                );
                            }}
                        />
                    </div>
                    <div className="">
                        <label htmlFor="duration">Duration</label>
                        <input
                            type="number"
                            id="duration"
                            name="duration"
                            placeholder="Enter number of days"
                            className="form-input placeholder:text-gray-100"
                            onChange={e =>
                                handleChange('duration', Number(e.target.value))
                            }
                        />
                    </div>
                    {selectItems.map(item => (
                        <div key={item}>
                            <label htmlFor={item}>{formatKey(item)}</label>
                            <ComboBoxComponent
                                id={item}
                                dataSource={comboBoxItems[item].map(_item => ({
                                    text: _item,
                                    value: _item,
                                }))}
                                fields={{ text: 'text', value: 'value' }}
                                placeholder={`Select ${formatKey(item)}`}
                                className="combo-box"
                                change={(e: { value: string | undefined }) => {
                                    if (e.value) {
                                        handleChange(item, e.value);
                                    }
                                }}
                                allowFiltering={true}
                                filtering={(e: FilteringEventArgs) => {
                                    const query = e.text.toLowerCase();
                                    e.updateData(
                                        comboBoxItems[item]
                                            .filter(_item =>
                                                _item
                                                    .toLowerCase()
                                                    .includes(query),
                                            )
                                            .map(_item => ({
                                                text: _item,
                                                value: _item,
                                            })),
                                    );
                                }}
                            />
                        </div>
                    ))}
                    <div className="">
                        <label htmlFor="location">
                            Location on the world map
                        </label>
                        <MapsComponent>
                            <LayersDirective>
                                <LayerDirective
                                    dataSource={mapData}
                                    shapeData={world_map}
                                    shapePropertyPath="name"
                                    shapeDataPath="country"
                                    shapeSettings={{
                                        colorValuePath: 'color',
                                        fill: '#E5E5E5',
                                    }}
                                />
                            </LayersDirective>
                        </MapsComponent>
                    </div>
                    <div className="bg-gray-200 h-px w-full" />
                    {error ? (
                        <div className="error">
                            <p>{error}</p>
                        </div>
                    ) : null}
                    <footer className="px-6 w-full">
                        <ButtonComponent
                            type="submit"
                            className="button-class !h-12 w-full"
                            disabled={loading}>
                            <img
                                src={`/assets/icons/${
                                    loading ? 'loader' : 'magic-star'
                                }.svg`}
                                alt="button icon"
                                className={cn('size-5', {
                                    'animate-spin': loading,
                                })}
                            />
                            <span className="p-16-semibold text-white">
                                {loading ? 'Generating...' : 'Generate Trip'}
                            </span>
                        </ButtonComponent>
                    </footer>
                </form>
            </section>
        </main>
    );
};

export default CreateTrip;
