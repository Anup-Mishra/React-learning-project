import { configure,shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import Navigationitems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({adapter: new Adapter()});

describe('<Navigationitems test />',()=> {
    let wrapper;
    beforeEach(()=> {
        wrapper = shallow(<Navigationitems />);
    })
    it('should navigate two navigation items if it is not authenticated',()=>{
        expect(wrapper.find(NavigationItem)).toHaveLength(2); 
    });
    it('should navigate three navigation items if it is authenticated',()=>{
        wrapper.setProps({isAuhenticated: true});
        expect(wrapper.find(NavigationItem)).toHaveLength(3); 
    });
    it('should render logout component',()=>{
        wrapper.setProps({isAuhenticated: true});
        expect(wrapper.contains(<NavigationItem link='/logout'>Logout</NavigationItem>)).toEqual(true); 
    });
});