import { Button, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import SportsBarIcon from '@mui/icons-material/SportsBar';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Settings } from '@mui/icons-material';
import style from './overview.module.scss'
import { useNavigate } from 'react-router-dom';
import Spacer from '../../Common/Spacer';
import StatisticBox from '../../Common/InfoBox/StatisticBox';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { CommonReducerType } from '../../../Reducer/CommonReducer';
import { Money, Person, VisibilityOff } from '@mui/icons-material';
import { setDrinkCategories, setDrinks, setMembers } from '../../../Actions/CommonAction';
import { doGetRequest } from '../../Common/StaticFunctions';
import Infobox from '../../Common/InfoBox/Infobox';
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, YAxis } from 'recharts';
import TopDepter from '../Common/TopDepter/TopDepter';

declare global {
    interface Window { globalTS: { MOBILE_THRESHOLD: number, ICON_COLOR: string }; }
}

type Props = {}

const Overview = (props: Props) => {
    const navigate = useNavigate();
    const headingType = "h6"
    const buttonSize = { width: 50, height: 50 }
    const dispatch = useDispatch();

    const common: CommonReducerType = useSelector((state: RootStateOrAny) => state.common);

    useEffect(() => {
        if (common.drinks === null || common.members === null || common.drinkCategories === null) {
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
            doGetRequest("users").then((value) => {
                if (value.code === 200) {
                    dispatch(setMembers(value.content))
                }
            })
        }
    }, [common.drinks, common.members, common.drinkCategories, dispatch])

    const calcBudget = () => {
        let budget = 0
        common.members?.forEach(member => budget += member.balance)
        return budget
    }

    const calcHiddenUsers = () => {
        let amount = 0
        common.members?.forEach(member => amount += member.hidden ? 1 : 0)
        return amount
    }


    return (
        <>
            <div className={style.overview}>
                <StatisticBox
                    headline='Total Budget'
                    text={calcBudget().toFixed(2) + "???"}
                    icon={<Money />}
                    colorCode={window.globalTS.ICON_COLOR} />
                <StatisticBox
                    headline='Total Users'
                    text={common.members ? common.members.length.toString() : "0"}
                    icon={<Person />}
                    colorCode={window.globalTS.ICON_COLOR} />
                <StatisticBox
                    headline='Hidden User'
                    text={calcHiddenUsers().toString()}
                    icon={< VisibilityOff />}
                    colorCode={window.globalTS.ICON_COLOR} />
                <TopDepter members={common.members} />
                <Infobox headline='Money distribution' >
                    <AreaChart width={window.innerWidth / 3} height={200} data={common.members?.sort(
                        (m1, m2) => m1.balance - m2.balance).map(
                            (value) => {
                                return {
                                    Balances: value.balance
                                }
                            }
                        )
                    }>
                        <CartesianGrid strokeDasharray="3 3" />
                        <YAxis unit="???" />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="Balances" stroke="#bb58cc" fillOpacity={0.5} fill="#bb58cc" />
                    </AreaChart >
                </Infobox>
            </div>
            <div className={style.overview}>
                <Button
                    size="large"
                    className={style.button}
                    variant='contained'
                    onClick={() => navigate("drinks")}
                >
                    <SportsBarIcon sx={buttonSize} />
                    <Spacer horizontal={10} />
                    <Typography variant={headingType}>Getr??nke</Typography>

                </Button>
                <Button
                    size="large"
                    className={style.button}
                    variant='contained'
                    onClick={() => navigate("members")}
                >
                    <PersonIcon sx={buttonSize} />
                    <Spacer horizontal={10} />
                    <Typography variant={headingType}>Mitglieder</Typography>
                </Button>
                <Button
                    size="large"
                    className={style.button}
                    variant='contained'
                    onClick={() => navigate("transactions")}
                >
                    <ReceiptLongIcon sx={buttonSize} />
                    <Spacer horizontal={10} />
                    <Typography variant={headingType}>Transaktionen</Typography>
                </Button>
                <Button
                    size="large"
                    className={style.button}
                    variant='contained'
                    onClick={() => navigate("settings")}
                >
                    <Settings sx={buttonSize} />
                    <Spacer horizontal={10} />
                    <Typography variant={headingType}>Einstellungen</Typography>
                </Button>
            </div>
        </>
    )
}

export default Overview