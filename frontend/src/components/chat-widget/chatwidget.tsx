/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { FC, useEffect, useRef, useState } from 'react';
import RasaWebchat from 'rasa-webchat';
import { Box, useTheme } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { useStore } from 'stores/store-hooks';
import { useIntl } from 'react-intl';
import { isSupportedLanguage } from 'types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useNavigate, useSearchParams } from 'react-router-dom';
import topicIntentMap from './topic-to-intent.json';
interface IChatbotWidget {
  onNewMessage: (sessionId: string) => void;
}

interface IBotUtterance {
  metadata: {
    municipality?: string;
    show_recommendations?: null | boolean;
    utter_action?: string;
    template_name?: string;
  };
  buttons?: [];
  text?: string;
}

export const ChatbotWidget: FC<IChatbotWidget> = observer(
  ({ onNewMessage }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webchatRef = useRef<any | null>(null);
    const theme = useTheme();
    const intl = useIntl();
    const settingsStore = useStore('settingsStore');
    const recommendationsStore = useStore('recommendationsStore');
    const navigate = useNavigate();
    const { selectedLanguage } = settingsStore;
    const { selectedMunicipality } = recommendationsStore;
    const [searchParams, setSearchParams] = useSearchParams();
    const [initialIntent, setInitialIntent] = useState<string>('get_started');

    const intents: Record<string, string> = topicIntentMap;

    // Viewport size information needed to for example adjust message delay
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const showRecommendations = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
      if (webchatRef.current !== null) {
        const sessionId = webchatRef.current.getSessionId();
        if (sessionId) {
          settingsStore.chatSessionId = sessionId;
        }
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getChatId = () => {
      let sessionId = undefined;
      if (webchatRef.current !== null) {
        sessionId = webchatRef.current.getSessionId();
      }
      return sessionId;
    };

    // Update language parameter in chat socket connection
    // when it changes in the UI
    useEffect(() => {
      if (webchatRef.current) {
        webchatRef.current.updateSocketCustomData({
          language: selectedLanguage,
          municipality: selectedMunicipality,
          show_recommendations: showRecommendations,
        });
      }
    }, [selectedLanguage, selectedMunicipality, showRecommendations]);

    // Receive starting intent via url parameters
    useEffect(() => {
      const topicInUrl = (searchParams.get('topic') || '').toLowerCase();
      if (topicInUrl) {
        setInitialIntent(intents[topicInUrl] || 'get_started');
        if (!intents[topicInUrl]) {
          searchParams.delete('topic');
          setSearchParams(searchParams);
        }
      }
    }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

    const notifyOfNewMessage = () => {
      if (!settingsStore.chatSessionId) {
        settingsStore.chatSessionId = getChatId();
      }
      if (settingsStore.chatSessionId) {
        onNewMessage(settingsStore.chatSessionId);
      }
    };

    const onSocketEvent = {
      bot_uttered: (e: IBotUtterance) => {
        notifyOfNewMessage();
        if (e.metadata.municipality) {
          recommendationsStore.selectedMunicipality = e.metadata.municipality;
        }
      },
      connect: () => {
        settingsStore.chatSessionId = '';
        notifyOfNewMessage();
      },
      bot_language_changed: (e: { language: string }) => {
        if (e.language && isSupportedLanguage(e.language)) {
          navigate(`/${e.language}`);
        }
      },
      bot_municipality_changed: (e: { municipality: string }) => {
        if (e.municipality) {
          recommendationsStore.selectedMunicipality = e.municipality;
        }
      },
    };

    const onChatReset = () => {
      recommendationsStore.selectedMunicipality = null;
      recommendationsStore.setRecommendations([]);
    };

    const customMessageDelay = (message: string) => {
      // Default delay, use on smaller devices
      let delay = message.length * 30;

      if (!isSmall) {
        delay = delay * 0.75;
      }

      if (delay > 3 * 1000) delay = 3 * 1000;
      if (delay < 800) delay = 800;

      return delay;
    };

    return (
      <Box
        component="div"
        css={css`
          && {
            position: relative;
            overflow-y: hidden;
            width: 100%;
            flex: 1; // Take up available space

            .rw-conversation-container {
              border-radius: 0.75rem;
              box-shadow: none;

              .rw-new-message,
              .rw-message,
              .rw-response,
              .rw-client,
              .rw-reply {
                font-family: ${theme.typography.fontFamily};
              }

              .rw-reply {
                font-size: 1rem;
                color: ${theme.palette.text.primary};
                background-color: ${theme.palette.secondary.dark};
                border-color: ${theme.palette.divider};
                font-weight: 700;
                border-radius: 11px;
                line-height: 1.5rem;
                letter-spacing: 0;
                line-height: 1.5rem;
                transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1) 0s,
                  opacity 0.5s;
                text-decoration: none;
                cursor: pointer;
              }
              .rw-client {
                background-color: ${theme.palette.primary.main};
                border-color: ${theme.palette.primary.dark};
              }
            }

            // Remove blue highlight that appears on Apple devices
            .rw-carousel-container {
              *:focus {
                outline: 0 !important;
                box-shadow: 0 0 0 0 rgba(0, 0, 0, 0) !important;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
              }
            }

            .rw-carousel-card {
              .rw-carousel-card-title {
                font-weight: 600;
              }

              .rw-carousel-card-subtitle {
                font-size: 0.9rem;
                margin-top: 0.5rem;
                margin-bottom: 0;
                opacity: 0.9;
              }
              box-shadow: none;
              border-radius: 1rem;
            }

            .rw-carousel-buttons-container {
              a {
                box-shadow: none;
              }

              a.rw-reply {
                width: auto;
                margin-bottom: 0;
                font-size: 0.9rem;
                transition: box-shadow 0.4s ease-in-out 0s, color 0.3s;

                &:hover,
                &:focus {
                  color: ${theme.palette.text.secondary} !important;
                  box-shadow: inset 0 -18ex 0 0 ${theme.palette.primary.main};
                }
              }
            }

            // Submit button
            .rw-send .rw-send-icon-ready {
              fill: ${theme.palette.primary.dark};
            }

            // Delete button in the corner of the window
            .rw-delete-history-button {
              color: ${theme.palette.text.primary};
            }

            .rw-sender,
            .rw-new-message,
            .rw-send {
              background-color: ${theme.palette.background.paper};
            }

            .rw-sender {
              border-top: 1px solid ${theme.palette.primary.main};
              // border-radius: 0 0 1rem 1rem;
              font-weight: 500;
            }

            .rw-new-message {
              ::placeholder {
                /* Chrome, Firefox, Opera, Safari 10.1+ */
                letter-spacing: 0.018em;
                font-weight: 600;
                color: rgba(0, 0, 0, 0.6);
                opacity: 1; /* Firefox */
              }

              :-ms-input-placeholder {
                /* Internet Explorer 10-11 */
                letter-spacing: 0.018em;
                font-weight: 600;
                color: rgba(0, 0, 0, 0.6);
              }

              ::-ms-input-placeholder {
                /* Microsoft Edge */
                letter-spacing: 0.018em;
                font-weight: 600;
                color: rgba(0, 0, 0, 0.6);
              }
            }
          }
        `}
      >
        <RasaWebchat
          initPayload={`/${initialIntent}`}
          socketUrl={process.env.REACT_APP_CHATBOT_URL}
          socketPath={'/rasa/socket.io/'}
          title={'Palveluohjainbotti'}
          hideWhenNotConnected={false}
          showFullScreenButton={true}
          embedded={true}
          onSocketEvent={onSocketEvent}
          inputTextFieldHint={intl.formatMessage({
            id: 'ChatWidgetPrompt',
            defaultMessage: 'Kysy jotain...',
            description: 'Prompt shown in the input field of the chat widget',
          })}
          params={{
            storage: 'session',
          }}
          customData={{
            language: selectedLanguage,
            municipality: selectedMunicipality,
            show_recommendations: showRecommendations,
          }}
          onWidgetEvent={{
            onChatReset: onChatReset,
          }}
          assistBackgroundColor={theme.palette.bg.light} // Bot responses
          assistTextColor={theme.palette.text.primary}
          conversationBackgroundColor={'#fff'}
          showCarouselImages={false}
          carouselCardsBackground={theme.palette.secondary.main}
          carouselCardsTextColor={theme.palette.text.primary}
          carouselCardsButtonBackground={theme.palette.secondary.dark}
          carouselCardsButtonText={theme.palette.text.primary}
          carouselControlsBackground={theme.palette.primary.main}
          carouselControlsIconColor={'#fff'}
          customMessageDelay={customMessageDelay}
          showResetChatButton={true}
          resetPayload={'/get_started'}
          restartOnChatReset={true}
          newIdOnChatReset={true}
          resetChatConfirmTitle={intl.formatMessage({
            id: 'ResetChatConfirmationTitle',
            defaultMessage: 'Poista keskusteluhistoria',
            description:
              'Title for alert confirming whether user wants to delete conversation history',
          })}
          resetChatConfirmSubtitle={intl.formatMessage({
            id: 'ResetChatConfirmationExplanation',
            defaultMessage: '',
            description:
              'Additional explanation for alert confirming whether user wants to delete conversation history',
          })}
          resetChatConfirmButton={intl.formatMessage({
            id: 'ResetChatConfirm',
            defaultMessage: 'Poista historia',
            description: 'Button for deleting conversation history (in alert)',
          })}
          resetChatCancelButton={intl.formatMessage({
            id: 'ResetChatCancel',
            defaultMessage: 'Peruuta',
            description:
              'Button for cancelling deletion of conversation history (in alert)',
          })}
          connectingText={intl.formatMessage({
            id: 'ChatbotConnectionWaitingMessage',
            defaultMessage: 'Waiting for server...',
            description:
              'Message to shown in chat widget when connecting to chatbot is taking longer than usual',
          })}
          ref={webchatRef}
        />
      </Box>
    );
  },
);
