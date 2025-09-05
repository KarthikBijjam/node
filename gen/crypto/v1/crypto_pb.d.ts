import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv2";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file crypto/v1/crypto.proto.
 */
export declare const file_crypto_v1_crypto: GenFile;
/**
 * The message representing a cryptocurrency.
 *
 * @generated from message crypto.v1.Crypto
 */
export type Crypto = Message<"crypto.v1.Crypto"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
    /**
     * @generated from field: string price = 2;
     */
    price: string;
};
/**
 * Describes the message crypto.v1.Crypto.
 * Use `create(CryptoSchema)` to create a new message.
 */
export declare const CryptoSchema: GenMessage<Crypto>;
/**
 * Request to get one specific cryptocurrency.
 *
 * @generated from message crypto.v1.GetCryptoByNameRequest
 */
export type GetCryptoByNameRequest = Message<"crypto.v1.GetCryptoByNameRequest"> & {
    /**
     * @generated from field: string name = 1;
     */
    name: string;
};
/**
 * Describes the message crypto.v1.GetCryptoByNameRequest.
 * Use `create(GetCryptoByNameRequestSchema)` to create a new message.
 */
export declare const GetCryptoByNameRequestSchema: GenMessage<GetCryptoByNameRequest>;
/**
 * Response containing a single cryptocurrency.
 *
 * @generated from message crypto.v1.GetCryptoByNameResponse
 */
export type GetCryptoByNameResponse = Message<"crypto.v1.GetCryptoByNameResponse"> & {
    /**
     * @generated from field: crypto.v1.Crypto crypto = 1;
     */
    crypto?: Crypto;
};
/**
 * Describes the message crypto.v1.GetCryptoByNameResponse.
 * Use `create(GetCryptoByNameResponseSchema)` to create a new message.
 */
export declare const GetCryptoByNameResponseSchema: GenMessage<GetCryptoByNameResponse>;
/**
 * Request to list all cryptocurrencies.
 *
 * @generated from message crypto.v1.ListCryptosRequest
 */
export type ListCryptosRequest = Message<"crypto.v1.ListCryptosRequest"> & {
    /**
     * Optional filter string
     *
     * @generated from field: string name_filter = 1;
     */
    nameFilter: string;
};
/**
 * Describes the message crypto.v1.ListCryptosRequest.
 * Use `create(ListCryptosRequestSchema)` to create a new message.
 */
export declare const ListCryptosRequestSchema: GenMessage<ListCryptosRequest>;
/**
 * Response containing a list of cryptocurrencies.
 *
 * @generated from message crypto.v1.ListCryptosResponse
 */
export type ListCryptosResponse = Message<"crypto.v1.ListCryptosResponse"> & {
    /**
     * @generated from field: repeated crypto.v1.Crypto cryptos = 1;
     */
    cryptos: Crypto[];
};
/**
 * Describes the message crypto.v1.ListCryptosResponse.
 * Use `create(ListCryptosResponseSchema)` to create a new message.
 */
export declare const ListCryptosResponseSchema: GenMessage<ListCryptosResponse>;
/**
 * Service definition.
 *
 * @generated from service crypto.v1.CryptoService
 */
export declare const CryptoService: GenService<{
    /**
     * Get a single crypto by name.
     *
     * @generated from rpc crypto.v1.CryptoService.GetCryptoByName
     */
    getCryptoByName: {
        methodKind: "unary";
        input: typeof GetCryptoByNameRequestSchema;
        output: typeof GetCryptoByNameResponseSchema;
    };
    /**
     * Get a list of cryptos, optionally filtered by name.
     *
     * @generated from rpc crypto.v1.CryptoService.ListCryptos
     */
    listCryptos: {
        methodKind: "unary";
        input: typeof ListCryptosRequestSchema;
        output: typeof ListCryptosResponseSchema;
    };
}>;
//# sourceMappingURL=crypto_pb.d.ts.map