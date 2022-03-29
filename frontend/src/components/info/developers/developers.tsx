/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { FC, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import {
  Container,
  Typography,
  useTheme,
  Link,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableContainer,
} from '@material-ui/core';
import { useIntl } from 'react-intl';
import { BuildLinkForm } from './build-link-form';
import { FixedLink } from './fixed-link';
import { municipalities, topics } from '../../../constants';
import ReactMarkdown from 'react-markdown';
import widgetDoc from './widget-doc.md';

export const DocumentationPage: FC = () => {
  const theme = useTheme();
  const intl = useIntl();
  const [widgetDocMarkdown, setWidgetDocMarkdown] = useState('');

  useEffect(() => {
    fetch(widgetDoc)
      .then((res) => res.text())
      .then((text) => setWidgetDocMarkdown(text));
  }, []);

  return (
    <Container
      maxWidth="lg"
      css={css`
        && {
          section {
            padding-top: ${theme.spacing(2)}px;
            padding-bottom: ${theme.spacing(2)}px;
            &:last-of-type {
              padding-bottom: ${theme.spacing(6)}px;
            }
          }

          p {
            margin-bottom: ${theme.spacing(1)}px;
          }

          h {
            word-break: break-word;
          }

          h3,
          h4 {
            padding-bottom: ${theme.spacing(1)}px;
          }

          .inline-code,
          .code-block {
            font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
            background-color: ${theme.palette.bg.light};
          }

          .inline-code {
            padding: 0 ${theme.spacing(0.5)}px;
            line-height: inherit;
          }

          .code-block {
            font-size: 0.9rem;
            padding: ${theme.spacing(1)}px ${theme.spacing(2)}px;

            p {
              font-family: inherit;
              font-size: inherit;
              margin: 0;
            }
          }

          .code-with-link {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .code-block + p {
            margin-top: ${theme.spacing(1)}px;
          }
        }
      `}
    >
      <Typography
        variant="h1"
        color="primary"
        css={css`
          && {
            margin-bottom: 1rem;
          }
        `}
      >
        {intl.formatMessage({
          id: 'PageTitleForDevelopers',
          defaultMessage: 'Kehittäjille',
          description: 'Title for developer documentation page',
        })}
      </Typography>
      {/* Example link to the chatbot */}
      <FixedLink />
      <section>
        <Typography
          variant="h3"
          css={css`
            && {
              margin-bottom: 0.5rem;
            }
          `}
        >
          Ohjaus kunnan sivuilta
        </Typography>
        <Typography variant="body1">
          Kunnat voivat omilta verkkosivuiltaan ohjata kuntalaisia
          palveluohjaaja.fi:hin sijoittamalla haluamallaan tavalla
          verkkosivuille linkin tai linkkejä palveluohjaaja.fi-sivulle.
        </Typography>
        <Typography variant="body1">
          Jotta kuntalaisen ohjaus oikeiden palveluiden äärelle olisi
          sujuvampaa, linkkiin on mahdollista lisätä parametreja: kunta ja aihe.
          Näin chatbot tarjoaa suoraan halutun kunnan palveluita (ja
          valtakunnallisia palveluita) ja voi aloittaa keskustelun käyttäjää
          kiinnostavasta aiheesta yleisten tervehdysten ja ohjeiden sijaan.
        </Typography>
        <Typography variant="body1">
          Linkkiformaatti on seuraavanlainen:
        </Typography>
        <Typography variant="body1" className="code-block">
          {`palveluohjaaja.fi/{kieli (fi|en|sv)}?municipality={kunnan nimi}&topic={keskustelun aihe}`}
        </Typography>
        <Typography variant="body1">
          Mikään mainituista arvoista (kielipolku, kunnan nimi tai aihe) ei ole
          pakollinen. Aihe- ja kuntaparametrien keskinäisellä järjestyksellä ei
          myöskään ole väliä.
        </Typography>
      </section>
      {/* Language parameter */}
      <section>
        <Typography variant="h4">Kieli</Typography>
        <Typography variant="body1">
          Osoitteen polussa voidaan ensimmäisenä määritellä kieli:{' '}
          <span className="inline-code">fi</span> (suomi),{' '}
          <span className="inline-code">sv</span> (ruotsi) tai{' '}
          <span className="inline-code">en</span> (englanti). Tieto ei ole
          pakollinen vaan sen puuttuessa käyttäjälle tarjotaan oletuksena
          palvelua suomeksi tai kielistä sillä, jota hän on viimeksi palvelussa
          käyttänyt. Jos kunta tarjoaa verkkosivunsa usealla kielellä, on
          kielitiedon kautta kuitenkin mahdollista tarjota käyttäjälle
          yhtenäinen kokemus, kun sivujen kieli pysyy palveluun ohjattaessa
          samana.
        </Typography>
      </section>
      <section>
        <Typography variant="h4">Kunnan nimi</Typography>
        <Typography variant="body1">
          Kuntatiedon avulla voidaan ohjata käyttäjä suoraan oman kunnan
          palveluiden pariin. Kun kuntaparametri on asetettu Palveluohjaaja
          ehdottaa käyttäjälle palveluita kyseisestä kunnasta - sekä sopivia
          valtakunnallisia palveluita. Asetettu kuntarajaus näytetään
          käyttäjälle käyttöliittymässä ja hänen on mahdollisuus poistaa rajaus
          tai muuttaa sitä.
        </Typography>
        <Typography variant="body1">
          Kunnan nimi tulee antaa ilman välejä (esim. Koski Tl on KoskiTl),
          mutta ä ja ö kirjaimia voi käyttää. Kirjasinkoolla tai ä- ja
          ö-kirjainten käytöllä ei ole väliä, mutta selkeyden vuoksi alla arvot
          on kuvattu ilman ääkkösiä ja pienillä kirjaimilla.
        </Typography>
        <ParameterTable
          parameter={municipalities}
          explanationTitle={'Kunta'}
          paramTitle={'Kuntaparametrin arvo'}
          ariaLabel={'taulukko kuntaparametrin arvoista'}
        />
      </section>
      <section>
        <Typography variant="h4">Aiheparametri</Typography>
        <Typography variant="body1">
          Aiheparametrilla voidaan kertoa Palveluohjaajalle suoraan mitä
          käyttäjä on etsimässä, jolloin chatbot aloittaa keskustelun yleisen
          esittelyn ja kysymysten sijaan halutusta aiheesta. Kukin aiheparametri
          alla kuvatusta rajatusta joukosta vastaa botin tuntemaa
          käyttötapausta, kuten kirjastopalveluiden etsiminen.
        </Typography>
        <Typography variant="body1">
          Lista tulee päivittymään chatbotin kehityksen jatkuessa.{' '}
        </Typography>
        <ParameterTable
          parameter={topics}
          explanationTitle={'Keskustelupolku'}
          paramTitle={'Aiheparametrin arvo'}
          ariaLabel="taulukko aiheparametrin arvoista"
        />
      </section>
      <section>
        <Typography variant="h4">Esimerkkejä</Typography>
        <Typography variant="body1">Kirjastopalveluita Turussa</Typography>
        <div className="code-block code-with-link">
          <Typography variant="body1">{`palveluohjaaja.fi?municipality=turku&topic=library`}</Typography>
          <Link
            href="https://palveluohjaaja.fi?municipality=turku&topic=library"
            target="_blank"
          >
            Kokeile linkkiä <FontAwesomeIcon icon={faExternalLinkAlt} />
          </Link>
        </div>
        <Typography variant="body1">
          Liedon kunnan palveluita (ja valtakunnallisia palveluita).
        </Typography>
        <div className="code-block code-with-link">
          <Typography variant="body1">{`palveluohjaaja.fi/sv?municipality=lieto`}</Typography>
          <Link
            href="https://palveluohjaaja.fi/sv?municipality=lieto"
            target="_blank"
          >
            Kokeile linkkiä <FontAwesomeIcon icon={faExternalLinkAlt} />
          </Link>
        </div>
        <Typography variant="body1">
          Käyttäjä voi halutessaan poistaa kuntarajauksen tai muuttaa sitä
          keskustelun edetessä.
        </Typography>
      </section>
      <section>
        <Typography variant="h4">Muodosta linkki</Typography>
        <BuildLinkForm />
      </section>
      <section>
        <Typography variant="h3">Valmis linkkikomponentti</Typography>
        <Typography variant="body1">
          Yllä kuvatun kaltaisen linkin voi sijoittaa verkkosivulle kuten minkä
          tahansa muunkin linkin. Mikäli valmiin komponentin lisääminen pelkän
          linkin sijaan tuntuu helpommalta, on sitä varten toteutettu sivun
          oikeassa (tai vasemmassa) alakulmassa leivuja linkkielementti.
          Esimerkki elementistä on nähtävissä sivulla.
        </Typography>
        <ReactMarkdown>{widgetDocMarkdown}</ReactMarkdown>
      </section>
    </Container>
  );
};

interface IParameterTable {
  parameter: { id: string; textId: string }[];
  explanationTitle: string; // Title for the column for "explanations" of each parameter value
  paramTitle: string; // Title for column containing the actual parameter values
  ariaLabel: string;
}

const ParameterTable = ({
  parameter,
  explanationTitle,
  paramTitle,
  ariaLabel,
}: IParameterTable) => {
  const theme = useTheme();

  return (
    <TableContainer
      css={css`
        && {
          margin-top: 1rem;

          .MuiTable-root {
            width: fit-content;
          }

          .MuiTableCell-root {
            border-color: ${theme.palette.primary.main};
          }

          .MuiTableCell-head {
            border-bottom-width: 2px;
          }
        }
      `}
    >
      <Table aria-label={ariaLabel} size="small">
        <TableHead>
          <TableRow>
            <TableCell>{explanationTitle}</TableCell>
            <TableCell>{paramTitle}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parameter.map((param) => (
            <TableRow key={param.id}>
              <TableCell component="th" scope="row">
                {param.textId}
              </TableCell>
              <TableCell align="left">{param.id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
