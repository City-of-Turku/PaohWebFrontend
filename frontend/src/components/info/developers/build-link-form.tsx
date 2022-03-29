/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { FC, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { Typography, useTheme, Link } from '@material-ui/core';
import { languages, municipalities, topics } from '../../../constants';
import { TextFieldSelect } from 'components/forms/textfield-select';

export const BuildLinkForm: FC = () => {
  const municipalityOptions = [{ id: '', textId: '' }, ...municipalities];
  const topicOptions = [{ id: '', textId: '' }, ...topics];
  const languageOptions = [{ id: '', textId: '' }, ...languages];
  const [language, setLanguage] = useState<string>('');
  const [municipality, setMunicipality] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const theme = useTheme();

  const handleChangeMunicipality = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setMunicipality(event.target.value);
  };

  const handleChangeTopic = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
  };

  const handleChangeLang = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value);
  };

  const buildParameterLink = (
    langParam: string,
    municipalityParam: string,
    topicParam: string,
  ): string => {
    const base = 'palveluohjaaja.fi';
    const langPath = langParam ? `/${langParam}` : '';
    const params = [
      municipalityParam ? `municipality=${municipalityParam}` : '',
      topicParam ? `topic=${topicParam}` : '',
    ]
      .filter((e) => e.length > 0)
      .join('&');
    return base + langPath + (params ? '?' + params : '');
  };

  return (
    <form noValidate autoComplete="on">
      <div
        css={css`
            display: block;
            margin ${theme.spacing(1)}px;
            padding-bottom: 1rem;

            .MuiTextField-root {
              margin-top: 0.5rem;
              margin-left: 0;
              width: 25ch;
            }
  
            .MuiFormControl-root {
              margin-right: 1rem;
            }
          `}
      >
        <TextFieldSelect
          id="select-language"
          label="Kieli"
          options={languageOptions}
          value={language}
          onChange={handleChangeLang}
        />
        <TextFieldSelect
          id="select-municipality"
          label="Kunta"
          options={municipalityOptions}
          value={municipality}
          onChange={handleChangeMunicipality}
        />
        <TextFieldSelect
          id="select-topic"
          label="Aihe"
          options={topicOptions}
          value={topic}
          onChange={handleChangeTopic}
        />
      </div>
      <div className="code-block code-with-link">
        <Typography variant="body1">
          {buildParameterLink(language, municipality, topic)}
        </Typography>
        <Link
          href={'https://' + buildParameterLink(language, municipality, topic)}
          target="_blank"
        >
          Kokeile linkkiä <FontAwesomeIcon icon={faExternalLinkAlt} />
        </Link>
      </div>
    </form>
  );
};
