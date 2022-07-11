import React, { useEffect } from 'react'
import NavigationButton from '../../Common/NavigationButton/NavigationButton'
import Spacer from '../../Common/Spacer'
import AddDrink from './AddDrink'
import Drink from './Drink'
import style from './drinks.module.scss'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { CommonReducerType } from '../../../Reducer/CommonReducer';
import { doGetRequest } from '../../Common/StaticFunctions'
import { setDrinkCategories, setDrinks } from '../../../Actions/CommonAction'
import { Typography } from '@mui/material'

type Props = {}

const Drinks = (props: Props) => {
    const dispatch = useDispatch()
    const common: CommonReducerType = useSelector((state: RootStateOrAny) => state.common);

    useEffect(() => {

        doGetRequest("drinks").then((value) => {
            if (value.code === 200) {
                dispatch(setDrinks(value.content))
            }
        })
        doGetRequest("drinks/categories").then((value) => {
            if (value.code === 200) {
                dispatch(setDrinkCategories(value.content))
            }
        })


    }, [dispatch])
    return (
        <>
            <div className={style.drinksOutterContainer}>
                <AddDrink />
                <div className={style.drinksContainer}>
                    {common.drinkCategories?.map(category => {
                        const drinks = common.drinks?.filter(value => {
                            return value.category === category
                        });
                        console.log(drinks)
                        return <div className={style.drinksContainerInner}>
                            <Typography variant='h4' style={{ width: "100%" }}>{category}</Typography>
                            {drinks?.map((value) => {
                                return <Drink drink={value} />

                            })}
                        </div>


                    })}
                </div>

            </div>
            <Spacer vertical={50} />
            <NavigationButton destination='/admin' />
        </>
    )
}

export default Drinks