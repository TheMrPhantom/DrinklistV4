import style from './checkout.module.scss';
import React, { useEffect, useState } from 'react'
import CheckoutEntry from './CheckoutEntry';
import { doGetRequest } from '../../Common/StaticFunctions';
import { Checkout as CheckoutType, Member } from '../../../types/ResponseTypes';
import { Autocomplete, Button, TextField, Typography } from '@mui/material';
import { AddBox } from '@mui/icons-material';
import Spacer from '../../Common/Spacer';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { RootStateOrAny, useSelector } from 'react-redux';
import { CommonReducerType } from '../../../Reducer/CommonReducer';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import CloseIcon from '@mui/icons-material/Close';

type Props = {}

const Checkout = (props: Props) => {

    const [checkouts, setcheckouts] = useState<Array<CheckoutType>>([])
    const [isAddOpen, setisAddOpen] = useState(false)
    const [selectedUser, setselectedUser] = useState("")
    const [toCheckout, settoCheckout] = useState<Array<{ member: Member, amount: number }>>([])
    const common: CommonReducerType = useSelector((state: RootStateOrAny) => state.common);

    useEffect(() => {
        doGetRequest("checkout").then(value => {
            if (value.code === 200) {
                setcheckouts(value.content)
            }
        })
    }, [])


    const addDialog = () => {
        if (isAddOpen) {
            return <><TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Aktueller Kontostand</TableCell>
                            <TableCell>Buchung</TableCell>
                            <TableCell>Hinzufügen / <br /> Entfernen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <Autocomplete
                                    freeSolo
                                    options={common.members ? common.members.map(value => value.name) : []}
                                    value={selectedUser}
                                    onChange={(event, value) => { setselectedUser(value !== null ? value : "") }}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                            label='Name'
                                            variant='standard'
                                            onChange={(value) => { setselectedUser(value.target.value) }}
                                        />
                                    }
                                />
                            </TableCell>
                            <TableCell>
                            </TableCell>
                            <TableCell>
                            </TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => {
                                        const toAdd = common.members?.find(value => {
                                            return value.name === selectedUser
                                        })
                                        if (toAdd && toCheckout.find(value => value.member.id === toAdd.id) === undefined) {
                                            settoCheckout([...toCheckout, { member: toAdd, amount: 0 }].sort((a, b) => a.member.id - b.member.id))
                                            setselectedUser("")
                                        }
                                    }
                                    }
                                >
                                    <AddBox />
                                </Button>
                            </TableCell>
                        </TableRow>
                        {toCheckout.map((value) => {
                            return <TableRow>
                                <TableCell component="th" scope="row">
                                    {value.member.name}
                                </TableCell>
                                <TableCell>
                                    {value.member.balance.toFixed(2)}€
                                </TableCell>
                                <TableCell>
                                    <TextField label="Betrag" type="number" onChange={(textValue) => {
                                        const newValue = textValue.target.value
                                        const others = toCheckout.filter(checkout => checkout.member.id !== value.member.id)
                                        settoCheckout([...others, { member: value.member, amount: parseFloat(newValue) }].sort((a, b) => a.member.id - b.member.id))
                                    }} />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => {
                                            settoCheckout(toCheckout.filter(checkout => checkout.member.id !== value.member.id))
                                        }}
                                    >
                                        <IndeterminateCheckBoxIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        })}

                    </TableBody>
                </Table>
            </TableContainer>
                <Button
                    onClick={() => {
                        console.log(toCheckout)
                    }}
                >
                    Abrechnung abschließen
                </Button>
            </>

        } else {
            return <></>
        }
    }

    return (
        <div className={style.container}>
            <div className={style.newCheckoutContainer}>
                <div className={style.newCheckoutContainerHeadline}>
                    <Typography variant="h6">
                        Neue Abrechnung
                    </Typography>
                    <Button
                        onClick={() => setisAddOpen(!isAddOpen)}
                    >
                        {isAddOpen ? <CloseIcon /> : <AddBox />}
                    </Button>
                </div>
                {addDialog()}
            </div>
            <Spacer vertical={20} />

            {checkouts.map(value => <CheckoutEntry checkout={value} />)}
        </div>
    )
}

export default Checkout