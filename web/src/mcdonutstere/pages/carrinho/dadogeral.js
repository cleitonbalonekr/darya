import React from "react";
import {
  makeStyles,
  Grid,
  Divider,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Container,
} from "@material-ui/core/";
import { useAuth } from "../../contexts/auth";
import { useCart } from "../../contexts/cart";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
  },
  precoStyle: {
    color: "red",
  },
  divisorStyle: {
    marginBottom: 30,
  },
}));

export default function DadosGerais() {
  const classes = useStyles();
  const { addressId, cartItems } = useCart();
  const { user } = useAuth();

  function getDeliveryAddress() {
    if (addressId == "0") {
      return "Retirada no local";
    } else {
      const addressFound = user.address.find((add) => add._id == addressId);

      return `${addressFound.district.name} - ${addressFound.street} `;
    }
  }
  function getAddressRate() {
    const addressFound = user.address.find((add) => add._id == addressId);
    if (addressFound) return addressFound.district.rate.toFixed(2);
    else return 0.0;
  }
  function getTotal() {
    const total = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
    return (total + Number(getAddressRate())).toFixed(2);
  }
 

  return (
    <Container>
      <div className={classes.root}>
        <Grid container alignItems="center">
          <Typography gutterBottom variant="h5">
            {user.name}
          </Typography>
        </Grid>
        <Typography color="textSecondary" variant="body2">
          Endereço de entrega: {getDeliveryAddress()}
        </Typography>
        <Divider variant="middle" className={classes.divisorStyle} />
        <Typography color="textSecondary" variant="body2">
          Tel.: {user.phone.join(' ')}
        </Typography>
        <Divider variant="middle" className={classes.divisorStyle} />
        <Typography
          color="textSecondary"
          variant="body2"
          className={classes.precoStyle}
        >
          Taxa de entrega: {getAddressRate()}
        </Typography>
        <Divider variant="middle" className={classes.divisorStyle} />
        <Typography variant="body2" component="h3">
          Itens
        </Typography>
        <TableContainer className={classes.divisorStyle}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell align="right">Qtd.:</TableCell>
                <TableCell align="right">Preço unid.</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.product._id}>
                  <TableCell component="th" scope="row">
                    {item.product.name}
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right" className={classes.precoStyle}>
                    R$ {item.product.price.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h6" component="h4" className={classes.precoStyle}>
          Valor total: {getTotal()}
        </Typography>
      </div>
    </Container>
  );
}
