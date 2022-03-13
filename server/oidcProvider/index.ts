import { ClientMetadata, KoaContextWithOIDC, Provider } from "oidc-provider";

const clients: ClientMetadata[] = [
  {
    client_id: "test_app",
    grant_types: ["authorization_code"],
    client_secret: "abc",
    response_types: ["code"],
    redirect_uris: ["https://oidcdebugger.com/debug"],
  },
];

console.log(
  `${process.env.HOST}:${process.env.PORT}/${process.env.PROVIDER_URL}`
);

export const oidcProvider = new Provider(
  `${process.env.HOST}:${process.env.PORT}/${process.env.PROVIDER_URL}`,
  {
    clients: clients,
    pkce: {
      methods: ["S256"],
      required: () => {
        return false;
      },
    },
    interactions: {
      url(ctx: KoaContextWithOIDC, interaction: any) {
        return `${process.env.PROVIDER_URL}/interaction/${interaction.uid}`;
      },
    },
  }
);
