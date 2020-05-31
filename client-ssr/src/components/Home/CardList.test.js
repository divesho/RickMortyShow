import React from 'react';
import { shallow } from 'enzyme';
import CardList, { CardItem } from './CardList';
import { Typography } from '@material-ui/core';

it('renders without crashing', () => {

    shallow(<CardList progress={true} />);
});

it('renders no character profiles found', () => {

    const NoData = <Typography variant="h5">No Data Found</Typography>;
    const wrapper = shallow(<CardList characters={[]} />);
    
    expect(wrapper.contains(NoData)).toEqual(true);
});

it('renders two character profiles', () => {
    
    let characters = [
        {"id":1,"name":"Rick Sanchez","status":"Alive","species":"Human","type":"","gender":"Male","origin":{"name":"Earth (C-137)","url":"https://rickandmortyapi.com/api/location/1"},"location":{"name":"Earth (Replacement Dimension)","url":"https://rickandmortyapi.com/api/location/20"},"image":"https://rickandmortyapi.com/api/character/avatar/1.jpeg","url":"https://rickandmortyapi.com/api/character/1","created":"2017-11-04T18:48:46.250Z"},
        {"id":2,"name":"Morty Smith","status":"Alive","species":"Human","type":"","gender":"Male","origin":{"name":"Earth (C-137)","url":"https://rickandmortyapi.com/api/location/1"},"location":{"name":"Earth (Replacement Dimension)","url":"https://rickandmortyapi.com/api/location/20"},"image":"https://rickandmortyapi.com/api/character/avatar/2.jpeg","url":"https://rickandmortyapi.com/api/character/2","created":"2017-11-04T18:50:21.651Z"}
    ];
    const wrapper = shallow(<CardList characters={characters} />);

    expect(wrapper.find(CardItem)).toHaveLength(2);
});